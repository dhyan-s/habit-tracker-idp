from flask import Flask
from .homepage import home
from .auth import login, sign_up
from .todolist import todolist

def create_app():
    app = Flask(__name__)
    app.config['SECURITY_KEY'] = "sjkdfj283472983;sfd3{D8D8{{SDLKJ4LK4L4K4L4KL4L4KK44L}"
    
    app.register_blueprint(home, url_prefix="/")
    app.register_blueprint(login, url_prefix="/login/")
    app.register_blueprint(sign_up, url_prefix="/signup/")
    app.register_blueprint(todolist, url_prefix="/todolist/")
    
    return app