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


@app.route("/profile", methods=["GET", "PUT"])
@jwt_required()
def user_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    if request.method == "GET":
        # Return user profile information
        user_data = {
            "id": user.id,
            "name": user.name,
            "last_name": user.last_name,
            "address": user.address,
            "city": user.city,
            "phone_number": user.phone_number,
            "email": user.email,
        }

        return jsonify({"user": user_data})

    elif request.method == "PUT":
        # Update user profile information
        try:
            data = request.json
            user.name = data.get("name", user.name)
            user.last_name = data.get("last_name", user.last_name)
            user.address = data.get("address", user.address)
            user.city = data.get("city", user.city)
            user.phone_number = data.get("phone_number", user.phone_number)

            db.session.commit()

            return jsonify({"message": "Profile updated successfully"})
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": f"Failed to update profile: {str(e)}"}), 500

