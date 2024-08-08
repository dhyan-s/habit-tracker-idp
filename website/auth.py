from flask import Blueprint, render_template

# TODO: put all into one blueprint, auth
login = Blueprint("login", __name__)
sign_up = Blueprint("sign_up", __name__)
forgot_pwd = Blueprint("forgot_pwd", __name__)


@login.route('/')
def loginpage():
    return render_template("login.html")

@sign_up.route('/')
def signup_page():
    return render_template("sign_up.html")

@forgot_pwd.route('/')
def fp_page():
    return render_template("forgot_pwd.html")