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
from app import app

register = Blueprint('register', __name__)
bcrypt = Bcrypt(app)

def register_user_in_thread(name, last_name, address, city, phone_number, email, password):
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(name=name, last_name=last_name, address=address, city=city, phone_number=phone_number, email=email, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    send_confirmation_email(email)

def send_topic_creation_notification(email, topic_title):
    try:
        subject = "New Topic Created"
        body = f"Hello! A new topic with the title '{topic_title}' has been created on our platform."
        send_mail(subject, email, body)
        print("Topic creation notification email sent successfully!")
    except Exception as e:
        print(f"Error sending topic creation notification email: {e}")

@app.route("/register", methods=["POST"])
def register_user():
    try:
        name = request.json["name"]
        last_name = request.json["last_name"]
        address = request.json["address"]
        city = request.json["city"]
        phone_number = request.json["phone_number"]
        email = request.json["email"]
        password = request.json["password"]
    except KeyError as e:
        return jsonify({"error": f"Missing required key: {str(e)}"}), 400

    user_exists = User.query.filter_by(email=email).first()

    if user_exists:
        return jsonify({"error": "A user already exists with that email."}), 409

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(name=name, last_name=last_name, address=address, city=city, phone_number=phone_number, email=email, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    # send_confirmation_email(email)

    register_thread = threading.Thread(target=register_user_in_thread, args=(name, last_name, address, city, phone_number, email, password))
    register_thread.start()

    return jsonify({
        "message": "Registration in progress. Confirmation email will be sent shortly."
    })

    return jsonify({
        "message": "User registered successfully."
    })
