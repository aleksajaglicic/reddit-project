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


@app.route("/create_topic", methods=["POST"])
@jwt_required()
def create_community_topic():
    try:
        title = request.json["title"]
        description = request.json["content"]
    except KeyError as e:
        return jsonify({"error": f"Missing required key: {str(e)}"}), 400

    owner_id = get_jwt_identity()
    if owner_id:
        print(owner_id)
    else:
        print("no user id")

    existing_topic = Topic.query.filter_by(title=title).first()
    if existing_topic:
        return jsonify({"error": "Topic with the same title already exists for the user"}), 409

    topic = Topic(
        title=title,
        description=description,
        owner_id=owner_id,
    )

    db.session.add(topic)
    db.session.commit()

    user = User.query.get(owner_id)
    if user:
        send_topic_creation_notification(user.email, topic.title)

    return jsonify({
        "message": "Community topic created successfully.",
        "topic": {
            "id": topic.id,
            "title": topic.title,
            "description": topic.description,
            "owner_id": topic.owner_id,
        },
    })

@app.route("/subscribe", methods=["POST"])
@jwt_required()
def subscribe_topic():
    try:
        user_id = get_jwt_identity();
        topic_id = request.json["topic_id"]
        print("this is the user id: ", user_id);
        print("this is the topic id: ", topic_id)
    except KeyError as e:
        return jsonify({"error": f"Missing required key: {str(e)}"}), 400

    user_subscription = UserSubscriptions.query.filter_by(user_id=user_id, topic_id=topic_id).first()

    if user_subscription:
        return jsonify({"message": "User is already subscribed to this topic"}), 200

    new_subscription = UserSubscriptions(user_id=user_id, topic_id=topic_id)
    db.session.add(new_subscription)
    db.session.commit()

    return jsonify({"message": "User subscribed to the topic successfully"}), 200

@app.route("/unsubscribe", methods=["POST"])
@jwt_required()
def unsubscribe_topic():
    try:
        user_id = get_jwt_identity();
        topic_id = request.json["topic_id"]
        print("this is the user id: ", user_id);
        print("this is the topic id: ", topic_id)
    except KeyError as e:
        return jsonify({"error": f"Missing required key: {str(e)}"}), 400

    user_subscription = UserSubscriptions.query.filter_by(user_id=user_id, topic_id=topic_id).first()

    if user_subscription:
        db.session.delete(user_subscription)
        # return jsonify({"message": "User is already subscribed to this topic"}), 200

    #new_subscription = UserSubscriptions(user_id=user_id, topic_id=topic_id)
    #db.session.add(new_subscription)
    db.session.commit()

    return jsonify({"message": "User subscribed to the topic successfully"}), 200

@app.route("/isSubscribed", methods=["POST"])
@jwt_required()
def is_subscribed():
    try:
        user_id = get_jwt_identity();
        topic_id = request.json["topic_id"]
    except KeyError as e:
        return jsonify({"error": f"Missing required key: {str(e)}"}), 400

    user_subscription = UserSubscriptions.query.filter_by(user_id=user_id, topic_id=topic_id).first()

    if user_subscription:
        return jsonify({"isSubscribed": True}), 200
    else:
        return jsonify({"isSubscribed": False}), 200
