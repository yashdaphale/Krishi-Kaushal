from flask import Flask
from config import Config
from routes.home_routes import home
from routes.auth_routes import auth
from routes.equipment_routes import equipment
from routes.order_routes import order_bp
from routes.admin_routes import admin_bp
from routes.profile_routes import profile_bp  # ✅ Add this line
from services.db_service import close_db

app = Flask(__name__)
app.config.from_object(Config)

app.register_blueprint(home, url_prefix='/')
app.register_blueprint(auth, url_prefix='/auth')
app.register_blueprint(equipment, url_prefix='/equipment')
app.register_blueprint(order_bp, url_prefix='/order')
app.register_blueprint(admin_bp, url_prefix='/admin')
app.register_blueprint(profile_bp, url_prefix='/profile')  # ✅ Add this line

@app.teardown_appcontext
def teardown_db(exception):
    close_db()

if __name__ == '__main__':
    app.run(debug=True)
