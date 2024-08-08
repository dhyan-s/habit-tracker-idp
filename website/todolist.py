from flask import Blueprint, render_template

todolist = Blueprint("todolist", __name__)

@todolist.route("/")
def todolist_page():
    return render_template("todo_list.html")