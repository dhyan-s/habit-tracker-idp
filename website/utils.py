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
