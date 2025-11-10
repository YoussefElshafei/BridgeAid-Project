# app/incidents/routes.py
import math
import os
import time
import json
from datetime import datetime, timedelta, timezone

import requests
from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import google.generativeai as genai

from . import incidents_bp
from app.models import (
    INCIDENT_TYPES,
    INCIDENT_REPORTS,
    CONFIRMED_INCIDENTS,
    LLM_CONFIRMED_INCIDENTS,
    DISTANCE_THRESHOLD_M,
    CLUSTER_THRESHOLD,
    TIME_WINDOW_HOURS,
)

# -----------------------
# Utility helpers
# -----------------------
def now_utc():
    return datetime.now(timezone.utc)

def is_nearby(lat1, lng1, lat2, lng2, threshold_meters=DISTANCE_THRESHOLD_M):
    """Haversine distance <= threshold_meters?"""
    R = 6371000
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lng2 - lng1)
    a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1))*math.cos(math.radians(lat2))*math.sin(dlon/2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    return (R * c) <= threshold_meters

def user_duplicate(user, incident, lat, lng, cooldown_minutes=10):
    """Block same user reporting the same incident within radius during cooldown."""
    cutoff = now_utc() - timedelta(minutes=cooldown_minutes)
    for r in reversed(INCIDENT_REPORTS[-200:]):  # scan recent only
        if r["userId"] == user and r["incident"] == incident and r["timestamp"] >= cutoff:
            if is_nearby(lat, lng, r["lat"], r["lng"]):
                return True
    return False

def cluster_for(incident, lat, lng):
    """Collect nearby reports for the same incident."""
    nearby = [r for r in INCIDENT_REPORTS if r["incident"] == incident and is_nearby(lat, lng, r["lat"], r["lng"])]
    users = {r["userId"] for r in nearby}
    return users, nearby

def upsert_confirmed(incident, lat, lng, users_set):
    """Merge into an existing confirmed cluster if close; otherwise create new."""
    for c in CONFIRMED_INCIDENTS:
        if c["incident"] == incident and is_nearby(lat, lng, c["lat"], c["lng"]):
            c["verified_users"] = sorted(list(set(c["verified_users"]) | users_set))
            c["report_count"] = len(c["verified_users"])
            return c

    incident_id = f"{incident}_{round(lat, 4)}_{round(lng, 4)}"
    entry = {
        "incident_id": incident_id,
        "incident": incident,
        "lat": float(lat),
        "lng": float(lng),
        "report_count": len(users_set),
        "verified_users": sorted(list(users_set)),
        "timestamp": now_utc().isoformat(),
    }
    CONFIRMED_INCIDENTS.append(entry)
    return entry

# -----------------------
# Geocoding (OpenStreetMap Nominatim)
# -----------------------
_GEOCODE_CACHE = {}  # addr_norm -> (lat, lng, ts)

def _norm_addr(addr: str) -> str:
    return " ".join((addr or "").strip().lower().split())

def geocode_nominatim(address: str, countrycodes: str | None = None, lang: str = "en"):
    """
    Convert an address to (lat, lng, display_name) using OSM Nominatim.
    Uses a tiny in-process cache to avoid rate limits.
    """
    addr_norm = _norm_addr(address)
    if not addr_norm:
        return None, None, ""

    # cache 10 minutes
    cached = _GEOCODE_CACHE.get(addr_norm)
    if cached and time.time() - cached[2] < 600:
        lat, lon = cached[0], cached[1]
        return lat, lon, address  # display_name not cached to keep cache small

    try:
        url = "https://nominatim.openstreetmap.org/search"
        params = {
            "q": address,
            "format": "jsonv2",
            "limit": 1,
            "addressdetails": 0,
            "accept-language": lang,
        }
        if countrycodes:
            params["countrycodes"] = countrycodes  # e.g., "ca"
        headers = {
            "User-Agent": "BridgeAid/1.0 (contact: your-email@example.com)"
        }
        resp = requests.get(url, params=params, headers=headers, timeout=12)
        if resp.status_code == 429:
            time.sleep(1.2)
            resp = requests.get(url, params=params, headers=headers, timeout=12)
        if resp.status_code != 200:
            return None, None, ""
        data = resp.json()
        if not data:
            return None, None, ""
        first = data[0]
        lat = round(float(first["lat"]), 6)
        lon = round(float(first["lon"]), 6)
        display_name = first.get("display_name", address)
        _GEOCODE_CACHE[addr_norm] = (lat, lon, time.time())
        return lat, lon, display_name
    except Exception:
        return None, None, ""

# -----------------------
# Gemini (LLM) verification
# -----------------------
def llm_search_and_verify(query: str):
    """
    Calls Gemini to verify using web knowledge (if available on your account).
    Reads API key from GOOGLE_API_KEY env var.
    Returns dict: {"verified": bool, "summary": str, "sources": [urls...]}
    """
    api_key = 'AIzaSyC7gE7v3f2lr_pYLKXiVEbPZVoWsf5F5Jg'
    if not api_key:
        return {"verified": False, "summary": "No Gemini API key set.", "sources": []}

    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel("gemini-1.5-pro")

        prompt = f"""
You are verifying a reported natural-disaster incident based on public information within the last 24 hours.

Query: {query}

Return ONLY valid JSON with these fields:
{{
  "verified": true|false,
  "summary": "short 1-2 sentence justification",
  "sources": ["https://...", "https://..."]
}}
"""
        resp = model.generate_content(prompt)
        text = (resp.text or "").strip()

        start = text.find("{")
        end = text.rfind("}")
        data = json.loads(text[start:end+1]) if start != -1 and end != -1 else {}
        return {
            "verified": bool(data.get("verified", False)),
            "summary": str(data.get("summary", "")),
            "sources": list(data.get("sources", [])),
        }
    except Exception as e:
        return {"verified": False, "summary": f"Gemini error: {e}", "sources": []}

def verify_with_llm_last_24h():
    """Verify only confirmed incidents in the last TIME_WINDOW_HOURS; append to LLM_CONFIRMED_INCIDENTS."""
    cutoff = now_utc() - timedelta(hours=TIME_WINDOW_HOURS)
    already = {x["incident_id"] for x in LLM_CONFIRMED_INCIDENTS}
    for c in CONFIRMED_INCIDENTS:
        ts = datetime.fromisoformat(c["timestamp"])
        if ts < cutoff or c["incident_id"] in already:
            continue
        query = (f"{c['incident']} near lat {c['lat']}, lng {c['lng']} in the past 24 hours. "
                 f"Search credible local/news/government sources.")
        result = llm_search_and_verify(query)
        if result.get("verified"):
            LLM_CONFIRMED_INCIDENTS.append({
                "incident_id": c["incident_id"],
                "incident": c["incident"],
                "lat": c["lat"],
                "lng": c["lng"],
                "verified_at": now_utc().isoformat(),
                "summary": result.get("summary", ""),
                "sources": result.get("sources", []),
            })

# -----------------------
# Routes
# -----------------------
@incidents_bp.get("/types")
def incident_types():
    """Dropdown values for the client."""
    return jsonify(incident_types=INCIDENT_TYPES)

@incidents_bp.post("/report")
@jwt_required()
def report():
    """
    Report an incident by address (server geocodes via OSM Nominatim).

    Body JSON:
    {
      "type": "Flooding",
      "address": "123 Main St, Milton, ON"
    }
    """
    data = request.get_json(silent=True) or {}
    incident = (data.get("type") or "").strip()
    address = (data.get("address") or "").strip()

    if not incident:
        return jsonify(error="type is required"), 400
    if incident not in INCIDENT_TYPES:
        return jsonify(error="invalid type"), 400
    if not address:
        return jsonify(error="address is required"), 400

    # Bias to Canada ("ca"); tweak/remove as needed.
    lat, lng, resolved = geocode_nominatim(address, countrycodes="ca", lang="en")
    if lat is None or lng is None:
        return jsonify(error="could not geocode address"), 400

    user = get_jwt_identity()
    if user_duplicate(user, incident, lat, lng, cooldown_minutes=10):
        return jsonify(error="duplicate report (cooldown active)"), 429

    rep = {
        "id": f"rep-{len(INCIDENT_REPORTS)+1}",
        "incident": incident,
        "userId": user,
        "lat": lat,
        "lng": lng,
        "address": resolved or address,
        "timestamp": now_utc(),
    }
    INCIDENT_REPORTS.append(rep)

    users_set, _nearby = cluster_for(incident, lat, lng)
    confirmed_entry = None
    confirmed = False
    if len(users_set) >= CLUSTER_THRESHOLD:
        confirmed_entry = upsert_confirmed(incident, lat, lng, users_set)
        confirmed = True

    return jsonify(
        message="report accepted",
        report_id=rep["id"],
        lat=lat, lng=lng, address=rep["address"],
        confirmed=confirmed,
        confirmed_entry=confirmed_entry
    ), 201

@incidents_bp.get("")
def list_confirmed():
    """List confirmed incidents; also run LLM verification for the last 24 hours."""
    verify_with_llm_last_24h()
    return jsonify(
        confirmed=CONFIRMED_INCIDENTS,
        llm_confirmed=LLM_CONFIRMED_INCIDENTS,
        totals={
            "reports": len(INCIDENT_REPORTS),
            "confirmed": len(CONFIRMED_INCIDENTS),
            "llm_confirmed": len(LLM_CONFIRMED_INCIDENTS),
        }
    )
