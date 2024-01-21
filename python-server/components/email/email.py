import threading
from datetime import datetime, timezone, timedelta
import json
from concurrent.futures import ThreadPoolExecutor
from flask_mail import Mail, Message
from flask import Flask, jsonify, request, abort, make_response, render_template, session, Blueprint, copy_current_request_context
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager
from flask_jwt_extended import unset_jwt_cookies
from database import init_db, User, Topic, Post, Comment, UserSubscriptions, UserLikes, db
from config import ApplicationConfig
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import joinedload
from uuid import uuid4

mail = Mail()

def init_email(app):
    mail.init_app(app)

def send_mail(subject, recipient, body):
    try:
        with app.app_context():  # Create application context
            msg = Message(subject, recipients=[recipient], body=body)
            mail.send(msg)
            print("//////////////////////Email sent successfully!////////////////////////////////")
    except Exception as e:
        print(f"!////////////////////////////////Error sending email: {e}!////////////////////////////////")

def send_mail_async(subject, recipient, body):
    with app.app_context():  # Create application context
        executor.submit(send_mail, subject, recipient, body)

def send_confirmation_email_async(email):
    subject = "Confirmation Email"
    body = f"Thank you for registering on our platform! Your email {email} has been confirmed."
    send_mail_async(subject, email, body)
