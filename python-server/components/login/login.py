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

login = Blueprint('login', __name__)

def login_user(email, password):
    user = User.query.filter_by(email=email).first()

    if user is None:
        return jsonify({"error": "Unauthorized"}), 401

    print(f"Received password: {password}")
    print(f"Stored hashed password: {user.password}")

    try:
        if not bcrypt.check_password_hash(user.password, password):
            return jsonify({"error": "Bad email or password"}), 401
    except Exception as e:
        print(f"Error checking password hash: {e}")
        return jsonify({"error": "Internal Server Error"}), 500

    access_token = create_access_token(identity=user.id)
    return jsonify(access_token=access_token, user={"id": user.id, "email": user.email})

@app.route("/login", methods=["POST"])
def login_user_route():
    email = request.json["email"]
    password = request.json["password"]

    return login_user(email, password)

@app.route("/logout", methods=["POST"])
def logout():
    response = jsonify({"message": "logout succesful"})
    unset_jwt_cookies(response)
    return response
