# routes/profile_routes.py
from flask import Blueprint, render_template

profile_bp = Blueprint('profile', __name__)

@profile_bp.route('/MyProfile')
def my_profile():
    return render_template('MyProfile.html')
