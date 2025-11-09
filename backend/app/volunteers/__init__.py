from flask import Blueprint
volunteer_bp = Blueprint("volunteer", __name__)
from . import routes