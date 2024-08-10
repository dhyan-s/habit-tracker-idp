from . import db
from flask_login import UserMixin


class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(150), unique=True)
    password = db.Column(db.String(150))
    firstname = db.Column(db.String(150))
    habits = db.relationship('Habit', backref='user')


class Habit(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150))
    notes = db.Column(db.String(10000))
    forever = db.Column(db.Boolean)
    start_date = db.Column(db.String(10))
    end_date = db.Column(db.String(10))
    days = db.Column(db.String(50))
    reminder = db.Column(db.Boolean)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    
