from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, String
from sqlalchemy.orm import relationship
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
    phone_number = db.Column(db.String(48), unique=False, nullable=True)
    email = db.Column(db.String(345), unique=True, nullable=False)
    password = db.Column(db.Text, nullable=False)
    likes = db.relationship('UserLikes', back_populates='user', cascade="all, delete-orphan")
    subscriptions = db.relationship('UserSubscriptions', back_populates='user')

class Topic(db.Model):
    __tablename__ = "topics"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(2000), nullable=False)
    owner_id = db.Column(db.String(32), db.ForeignKey('users.id'), nullable=False)
    owner = db.relationship('User', backref='topics')
    timestamp = db.Column(db.DateTime, default=datetime.utcnow(), nullable=False)
    closed = db.Column(db.Boolean, default=False)
    subscribers = db.relationship('UserSubscriptions', back_populates='topic')

class Post(db.Model):
    __tablename__ = "posts"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    content = db.Column(db.String(2000), nullable=False)
    owner_id = db.Column(db.String(32), db.ForeignKey('users.id'), nullable=False)
    topic_id = db.Column(db.Integer, db.ForeignKey('topics.id'), nullable=False)
    owner = db.relationship('User', backref='posts')
    closed = db.Column(db.Boolean, default=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow(), nullable=False)
    likes_users = db.relationship('UserLikes', back_populates='post', cascade="all, delete-orphan")

    @property
    def owner_name(self):
        user = db.session.query(User).filter_by(id=self.owner_id).first()
        return user.name if user else None

    @property
    def topic_name(self):
        topic = db.session.query(Topic).filter_by(id=self.topic_id).first()
        return topic.title if topic else None

    @property
    def num_likes(self):
        return len(self.likes_users)
    
    @property
    def num_comments(self):
        return Comment.query.filter_by(post_id=self.id).count()

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
    likes_users = db.relationship('UserLikes', back_populates='comment', cascade="all, delete-orphan")

    @property
    def num_likes(self):
        return len(self.likes_users)

class UserLikes(db.Model):
    __tablename__ = "userLikes"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(32), db.ForeignKey('users.id'))
    comment_id = db.Column(db.Integer, db.ForeignKey('comments.id'))
    comment = db.relationship('Comment', back_populates='likes_users')
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'))
    like_status = db.Column(db.Boolean)
    user = db.relationship('User', back_populates='likes')
    post = db.relationship('Post', back_populates='likes_users')


class UserSubscriptions(db.Model):
    __tablename__ = "userSubscriptions"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(32), db.ForeignKey('users.id'))
    topic_id = db.Column(db.Integer, db.ForeignKey('topics.id'))
    user = db.relationship('User', back_populates='subscriptions')
    topic = db.relationship('Topic', back_populates='subscribers')

def init_db(app):
    if not hasattr(app, 'extensions'):
        app.extensions = {}
    if 'sqlalchemy' not in app.extensions:
        db.init_app(app)
    with app.app_context():
        db.create_all()
