from datetime import datetime
from .models import Habit, HabitCompletion

def weekday_str_from_no(weekday_no):
    weekday_dict = {
        '0': "mon",
        '1': "tue",
        '2': "wed",
        '3': "thu",
        '4': "fri",
        '5': "sat",
        '6': "sun",
    }
    return weekday_dict[str(weekday_no)]


def weekday_no_from_str(day: str):
    weekday_map = {
        'mon': 0,
        'tue': 1,
        'wed': 2,
        'thu': 3,
        'fri': 4,
        'sat': 5,
        'sun': 6,
    }
    return weekday_map[day]


def habit_class_to_dict(habit: Habit):
    return {
        'id': habit.id,
        'name': habit.name,
        'notes': habit.notes,
        'forever': habit.forever,
        'start_date': habit.start_date,
        'end_date': habit.end_date,
        'days': habit.days,
        'reminder': habit.reminder,
        'user_id': habit.user_id
    }


def habit_completion_class_to_dict(habit_completion: HabitCompletion):
    return {
        'id': habit_completion.id,
        'habit_id': habit_completion.habit_id,
        'date': habit_completion.date,
        'completion_notes': habit_completion.completion_notes,
    }
