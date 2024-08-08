from flask import Flask
from flask_login import LoginManager
from flask_sqlalchemy import SQLAlchemy
import os
from .homepage import home
from .todolist import todolist

db = SQLAlchemy()
DB_NAME = "database.db"

def create_database(app):
    app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{DB_NAME}"
    db.init_app(app)
    if not os.path.exists(f'website/{DB_NAME}'):
        with app.app_context():
            db.create_all()
            print("Created Database!")        
            
def register_blueprints(app):
    from .auth import login_bp, signup_bp, forgotpwd_bp, logout_bp
    
    app.register_blueprint(home, url_prefix="/")
    app.register_blueprint(login_bp, url_prefix="/login/")
    app.register_blueprint(signup_bp, url_prefix="/signup/")
    app.register_blueprint(todolist, url_prefix="/todolist/")
    app.register_blueprint(forgotpwd_bp, url_prefix="/fp/")
    app.register_blueprint(logout_bp, url_prefix="/logout/")
    
def create_login_manager(app):
    from .models import User
    login_manager = LoginManager()
    login_manager.login_view = 'login.login'
    login_manager.init_app(app)
    
    @login_manager.user_loader
    def load_user(id):
        return User.query.get(int(id))

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = "sjkdfj283472983;sfd3{D8D8{{SDLKJ4LK4L4K4L4KL4L4KK44L}"

    create_login_manager(app)
    register_blueprints(app)
    create_database(app)
    
    return app