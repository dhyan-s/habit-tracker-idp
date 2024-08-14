from flask import Blueprint, render_template
from flask_login import login_required, current_user

home = Blueprint("home", __name__)
review_progress = Blueprint("review_progress", __name__)


@home.route("/")
@login_required
def homepage():
    return render_template("homepage.html", user=current_user)


@review_progress.route("/")
def review_page():
    return render_template("review.html")
