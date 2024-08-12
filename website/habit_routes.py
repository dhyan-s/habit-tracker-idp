from flask import Blueprint, request, jsonify
from flask_login import current_user
from .models import Habit, HabitCompletion
from .utils import weekday_from_date, weekday_no_from_str
from datetime import datetime, timedelta

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
    
    habit_dict = {
        'name': habit_name,
        'notes': notes,
        'forever': forever,
        'start_date': start_date,
        'end_date': end_date,
        'days': days,
        'reminder': reminder,
        'user_id': current_user.id
    }
    
    new_habit = Habit(**habit_dict)
    
    db.session.add(new_habit)
    db.session.commit()
    
    habit_dict = {'id': new_habit.id, **habit_dict}
    
    return jsonify(habit_dict)


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


@habit_control.route("/get_weekly_completion")
def get_weekly_completion():
    habit_id = request.args.get('habit_id', default='', type=str)
    if not habit_id:
        return jsonify({})
    habit_id = int(habit_id)
    
    today = datetime.now()
    start_of_week = today - timedelta(days=today.weekday())
    end_of_week = start_of_week + timedelta(days=6)
    
    completions = HabitCompletion.query.filter(
        HabitCompletion.habit_id == habit_id,
        HabitCompletion.date >= start_of_week,
        HabitCompletion.date <= end_of_week,
    ).all()
    
    habit = Habit.query.get(habit_id)
    all_days = [weekday_no_from_str(day) for day in habit.days.split()]
    today_weekday = today.weekday()
    
    weekly_completion = {day: None for day in all_days}
    completed_days = [completion.date.weekday() for completion in completions]
    
    for day in all_days:
        weekly_completion[day] = day in completed_days if day < today_weekday else None
        
    return jsonify(weekly_completion)
    