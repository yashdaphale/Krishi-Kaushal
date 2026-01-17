from flask import Blueprint, render_template, request, redirect, url_for, flash, session
from models.admin_model import get_admin
from werkzeug.security import check_password_hash

admin_bp = Blueprint('admin', __name__)

# Admin Login Route
@admin_bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        admin = get_admin(username)
        if admin and check_password_hash(admin['password'], password):
            session['admin_logged_in'] = True
            flash('Login successful!', 'success')
            return redirect(url_for('admin.dashboard'))
        else:
            flash('Invalid username or password', 'danger')

    return render_template('admin/admin_login.html')

# Admin Dashboard Route
@admin_bp.route('/dashboard')
def dashboard():
    if not session.get('admin_logged_in'):
        flash('Please log in first.', 'warning')
        return redirect(url_for('admin.login'))

    admin_name = session.get('admin_name')
    return render_template('admin/admin_dashboard.html', admin_name=admin_name)

# Admin Logout Route
@admin_bp.route('/logout')
def logout():
    session.pop('admin_logged_in', None)
    flash('Logged out successfully!', 'success')
    return redirect(url_for('admin.login'))
