from flask import Blueprint, request, jsonify
from flask_login import current_user
from sqlalchemy import Date, func, desc
from .models import Habit, HabitCompletion
from .utils import habit_completion_class_to_dict, weekday_str_from_no, weekday_no_from_str, habit_class_to_dict
from datetime import datetime, timedelta

habit_control = Blueprint("habit_routes", __name__)


def validate_habit_id():
    habit_id = request.args.get('habit_id', default='', type=str)
    if not habit_id:
        return jsonify({"error": "Habit ID not provided"}), 400
    try:
        return int(habit_id), 200
    except ValueError:
        return jsonify({"error": f"Invalid habit_id: {habit_id}"}), 400


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
        name = habit_name,
        notes = notes,
        forever = forever,
        start_date = start_date,
        end_date = end_date,
        days = days,
        reminder = reminder,
        user_id = current_user.id
    )
    
    db.session.add(new_habit)
    db.session.commit()
    
    habit_dict = habit_class_to_dict(new_habit)
    
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
    if habit_id := request.args.get('habit_id', default='', type=str):
        habit_id = int(habit_id)
    else:
        return jsonify({})
    
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


@habit_control.route("/get_habit_by_id")
def get_habit_by_id():
    habit_id = request.args.get('habit_id', default='', type=str)
    if not habit_id:
        return jsonify({"error": "Habit ID not provided"}), 400
    try:
        habit_id = int(habit_id)
    except ValueError:
        return jsonify({"error": f"Invalid habit_id: {habit_id}"}), 400
    
    habit = Habit.query.get(habit_id)
    
    if habit is None:
        return jsonify({"error": "Habit not found"}), 404
    
    habit_data = habit_class_to_dict(habit)
    
    return jsonify(habit_data)


@habit_control.route("/get_all_habits")
def get_all_habits():
    habits = Habit.query.filter(Habit.user_id == current_user.id).all()
    habit_list = [habit_class_to_dict(habit) for habit in habits]
    return jsonify(habit_list)


@habit_control.route("/get_last_completed")
def get_last_completed():
    habit_id = validate_habit_id()
    if habit_id[1] != 200: # Check status code
        return habit_id
    
    habit = Habit.query.get(habit_id)
    
    last_completed = HabitCompletion.query.filter_by(habit_id=habit_id).order_by(HabitCompletion.date.desc()).first()
    
    if last_completed:
        return jsonify(last_completed.date.isoformat())
    else:
        return jsonify(None)


@habit_control.route("/get_todays_habits")
def get_todays_habits(): # Returns with completion data as well
    todays_date = datetime.now().date()
    todays_day = todays_date.weekday()
    todays_habits = Habit.query.filter(
        Habit.user_id == current_user.id,
        Habit.days.like(f"%{weekday_str_from_no(todays_day)}%")
        ).all()
    print(datetime.now(), todays_date, func.date(datetime.now()), todays_date == func.date(datetime.now()))
    todays_habits_data = []
    for habit in todays_habits:
        completion = HabitCompletion.query.filter(
            HabitCompletion.habit_id == habit.id,
            func.date(HabitCompletion.date) <= todays_date,
        ).order_by(desc(HabitCompletion.date)).first()
        print(habit.name, completion)
        todays_habits_data.append({
            **habit_class_to_dict(habit), 
            'completion':  habit_completion_class_to_dict(completion) if completion is not None else None
        })
    return todays_habits_data


@habit_control.route("/mark_habit_complete", methods=['POST'])
def mark_habit_complete():
    from . import db
    args = request.json
    habit_completion = HabitCompletion(habit_id=args['habit_id'],
                                       date=datetime.fromisoformat(args['date']),
                                       completion_notes=args['completion_notes'])
    db.session.add(habit_completion)
    db.session.commit()
    return jsonify({"message": "Completion registered successfully", **args}), 200
