from tracemalloc import start
from flask import Blueprint, request, jsonify
from flask_login import current_user
from .models import Habit

habit_control = Blueprint("habit_routes", __name__)


@habit_control.route("/create_habit", methods=['POST'])
def create_habit():
    from . import db
    
    data = request.json
    habit_name = data.get('habitName')
    notes = data.get('notes')
    forever = bool(data.get('forever') == 'yes')
    start_date = data.get('startDate')
    end_date = data.get('endDate')
    days = " ".join(data.get('days'))
    reminder = bool(data.get('reminder') == 'yes')
    
    new_habit = Habit(
        name=habit_name,
        notes=notes,
        forever=forever,
        start_date=start_date,
        end_date=end_date,
        days=days,
        reminder=reminder,
        user_id=current_user.id
    )
    
    db.session.add(new_habit)
    db.session.commit()
    
    return jsonify({'message': 'Habit created successfully!', 'habit_name': habit_name})


# @habit_control.route("/get_habit")

