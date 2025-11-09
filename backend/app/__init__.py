from datetime import timedelta
from flask import Flask
from flask_jwt_extended import JWTManager


def create_app():
    app = Flask(__name__)

    # --- Basic config (simple, no external files) ---
    app.config["JWT_SECRET_KEY"] = "dev-change-me"
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=8)

    # --- Init extensions ---
    JWTManager(app)

    # --- Register blueprints ---
    from app.auth import auth_bp
    from app.volunteers import volunteer_bp
    from app.incidents import incidents_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(volunteer_bp, url_prefix="/api/volunteers")
    app.register_blueprint(incidents_bp, url_prefix="/api/incidents")

    return app
