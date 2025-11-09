from flask import request, jsonify, make_response
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash

from . import auth_bp
from app.models import USERS

@auth_bp.post("/register")
def register():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not email or "@" not in email:
        return jsonify(error="valid email required"), 400
    if len(password) < 6:
        return jsonify(error="password must be at least 6 characters"), 400
    if email in USERS:
        return jsonify(error="email already registered"), 409

    USERS[email] = {"pw_hash": generate_password_hash(password)}
    return jsonify(message="registered", email=email), 201


@auth_bp.post("/login")
def login():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    user = USERS.get(email)
    if not user or not check_password_hash(user["pw_hash"], password):
        return jsonify(error="invalid credentials"), 401

    token = create_access_token(identity=email)
    resp = make_response(token, 200)  # raw token text
    resp.headers["Content-Type"] = "text/plain; charset=utf-8"
    return resp


@auth_bp.get("/me")
@jwt_required()
def me():
    return jsonify(email=get_jwt_identity())
