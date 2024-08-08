from flask import Blueprint, render_template

login = Blueprint("login", __name__)
sign_up = Blueprint("sign_up", __name__)


@login.route('/')
def loginpage():
    return render_template("login.html")

@sign_up.route('/')
def signup_page():
    return render_template("sign_up.html")