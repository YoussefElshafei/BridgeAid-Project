from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Health
@app.get("/api/health")
def health():
    return jsonify(message="health ok")

# Auth
@app.get("/api/auth/login")
def login_test_get():
    return jsonify(message="login route ok (GET)")
@app.post("/api/auth/login")
def login_test_post():
    return jsonify(message="login route ok (POST)")

@app.get("/api/auth/register")
def register_test_get():
    return jsonify(message="register route ok (GET)")
@app.post("/api/auth/register")
def register_test_post():
    return jsonify(message="register route ok (POST)")

# Volunteers
@app.get("/api/volunteers")
def volunteers_test_get():
    return jsonify(message="volunteers route ok (GET) — register as volunteer later")
@app.post("/api/volunteers")
def volunteers_test_post():
    return jsonify(message="volunteers route ok (POST)")

# Incidents
@app.get("/api/incidents")
def incidents_test_get():
    return jsonify(message="incidents route ok (GET)")
@app.post("/api/incidents")
def incidents_test_post():
    return jsonify(message="incidents route ok (POST)")

if __name__ == "__main__":
    app.run(port=5000)
