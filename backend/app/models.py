# Resets every restart — just for wiring the frontend now.
USERS = {}  # email -> {"pw_hash": "..."}
VOLUNTEERS = {}

# ---------- Incident config (tweak as needed) ----------
DISTANCE_THRESHOLD_M = 200     # meters (nearby radius)
CLUSTER_THRESHOLD = 3          # unique users required to confirm
TIME_WINDOW_HOURS = 24         # for LLM verification

# Allowed types for your dropdown
INCIDENT_TYPES = [
    "Power Outage",
    "Flooding",
    "Wildfire",
    "Road Blocked",
    "Bridge Damage",
    "Building Collapse",
    "Medical Emergency",
    "Gas Leak",
    "Landslide",
    "Storm Damage",
    "Water Contamination",
    "Communication Outage",
]

# ---------- In-memory stores ----------
# Raw reports (list of dicts)
INCIDENT_REPORTS = []  # [{id,user,type,address,lat,lng,timestamp}, ...]

# Confirmed incidents (3+ unique users)
CONFIRMED_INCIDENTS = []  # [{incident_id, incident, lat, lng, report_count, verified_users, timestamp}, ...]

# LLM-confirmed (subset of confirmed, within last 24h)
LLM_CONFIRMED_INCIDENTS = []  # [{incident_id, incident, lat, lng, verified_at, sources, summary}, ...]