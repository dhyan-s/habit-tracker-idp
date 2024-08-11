from flask import Blueprint, request, jsonify
from flask_login import current_user
from .models import Habit
from datetime import datetime

habit_control = Blueprint("habit_routes", __name__)


@habit_control.route("/create_habit", methods=['POST'])
def create_habit():
    from . import db
    
    data = request.json
    habit_name = data.get('habitName')
    notes = data.get('notes')
    forever = bool(data.get('forever') == 'yes')
    start_date = datetime(*[int(item) for item in data.get('startDate').split("-")]) if data.get('startDate') else None
    end_date = datetime(*[int(item) for item in data.get('endDate').split("-")]) if data.get('endDate') else None
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


@habit_control.route("/delete_habit", methods=['POST'])
def delete_habit():
    from . import db
    habit_id = int(request.data.decode('utf-8'))
    habit = Habit.query.get(habit_id)
    
    if habit is None:
        return jsonify({"error": "Habit not found"}), 404
    
    try:
        db.session.delete(habit)
        db.session.commit()
        return jsonify({"message": "Habit deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
