from flask_sqlalchemy import SQLAlchemy
from uuid import uuid4
from datetime import datetime

db = SQLAlchemy()

def get_uuid():
    return uuid4().hex

class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    name = db.Column(db.String(32), unique=False, nullable=False)
    last_name = db.Column(db.String(32), unique=False, nullable=False)
    address = db.Column(db.String(32), unique=False)
    city = db.Column(db.String(32), unique=False)
    phone_number = db.Column(db.String(48), unique=True)
    email = db.Column(db.String(345), unique=True, nullable=False)
    password = db.Column(db.Text, nullable=False)
    subscriptions = db.relationship('UserSubscriptions', back_populates='user')

class Topic(db.Model):
    __tablename__ = "topics"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    owner_id = db.Column(db.String(32), db.ForeignKey('users.id'), nullable=False)
    owner = db.relationship('User', backref='topics')
    timestamp = db.Column(db.DateTime, default=datetime.utcnow(), nullable=False)
    closed = db.Column(db.Boolean, default=False)
    subscribers = db.relationship('UserSubscriptions', back_populates='topic')

class Post(db.Model):
    __tablename__ = "posts"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    owner_id = db.Column(db.String(32), db.ForeignKey('users.id'), nullable=False)
    topic_id = db.Column(db.Integer, db.ForeignKey('topics.id'), nullable=False)
    owner = db.relationship('User', backref='posts')
    closed = db.Column(db.Boolean, default=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow(), nullable=False)
    likes = db.Column(db.Integer, default=0)

class Comment(db.Model):
    __tablename__ = "comments"
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.String(32), db.ForeignKey('users.id'), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'), nullable=False)
    user = db.relationship('User', backref='comments')
    topic_id = db.Column(db.Integer, db.ForeignKey('topics.id'), nullable=False)
    topic = db.relationship('Topic', backref='comments')
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    likes = db.Column(db.Integer, default=0)

class UserLikes(db.Model):
    __tablename__ = "userLikes"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(32), db.ForeignKey('users.id'))
    comment_id = db.Column(db.Integer, db.ForeignKey('comments.id'))
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'))
    like_status = db.Column(db.Boolean)
    user = db.relationship('User', back_populates='likes')
    comment = db.relationship('Comment', back_populates='likes')
    post = db.relationship('Post', back_populates='likes')

class UserSubscriptions(db.Model):
    __tablename__ = "userSubscriptions"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    topic_id = db.Column(db.Integer, db.ForeignKey('topic.id'))
    user = db.relationship('User', back_populates='subscriptions')
    topic = db.relationship('Topic', back_populates='subscribers')

def init_db(app):
    if not hasattr(app, 'extensions'):
        app.extensions = {}
    if 'sqlalchemy' not in app.extensions:
        db.init_app(app)
    with app.app_context():
        db.create_all()
