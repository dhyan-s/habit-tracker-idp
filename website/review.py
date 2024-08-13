from flask import Blueprint, render_template

review_progress = Blueprint("review_progress", __name__)

@review_progress.route("/")
def review_page():
    return render_template("review.html")
