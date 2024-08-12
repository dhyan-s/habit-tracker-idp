from datetime import datetime

def weekday_from_date(date: datetime):
    weekday = date.weekday()
    weekday_dict = {
        '0': "mon",
        '1': "tue",
        '2': "wed",
        '3': "thu",
        '4': "fri",
        '5': "sat",
        '6': "sun",
    }
    return weekday_dict[str(weekday)]

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
