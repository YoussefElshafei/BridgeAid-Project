from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from . import volunteer_bp
from app.models import VOLUNTEERS

@volunteer_bp.post("/register")
@jwt_required()
def register_volunteer():
    """
    Body JSON:
    {
      "legal_name": "First Last",
      "location": "Street, City, Province",
      "category": "Food Bank Volunteer | Disaster Relief Volunteer | Shelter Volunteer "
    }
    """
    data = request.get_json(silent=True) or {}
    legal_name = (data.get("legal_name") or "").strip()
    location   = (data.get("location") or "").strip()
    category   = (data.get("category") or "").strip()

    valid_categories = [
    "Food Bank Volunteer",
    "Disaster Relief Volunteer",
    "Shelter Volunteer"
]

    if not legal_name:
        return jsonify(error="legal_name is required"), 400
    if not location:
        return jsonify(error="location is required"), 400
    if not category:
        return jsonify(error="category is required"), 400
    if category not in valid_categories:
        return jsonify(error="invalid category"), 400

    email = get_jwt_identity()
    if email in VOLUNTEERS:
        return jsonify(error="already registered as volunteer"), 409

    VOLUNTEERS[email] = {
        "legal_name": legal_name,
        "location": location,
        "category": category,
    }
    return jsonify(message="volunteer registered",
                   email=email,
                   volunteer=VOLUNTEERS[email]), 201


@volunteer_bp.get("")
@jwt_required()
def list_volunteers():
    """
    Returns: [{email, legal_name, location, category}, ...]
    (Email included for uniqueness during demo; remove later if you want)
    """
    out = []
    for email, v in VOLUNTEERS.items():
        out.append({
            "email": email,
            "legal_name": v["legal_name"],
            "location": v["location"],
            "category": v["category"],
        })
    return jsonify(volunteers=out)
