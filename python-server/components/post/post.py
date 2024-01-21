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

@jwt_required()
@app.route("/create_post", methods=["POST"])
def create_post():
    try:
        title = request.json["title"]
        content = request.json["content"]
        owner_id = request.json["owner_id"]
        topic_id = request.json["topic_id"]
        post_id = request.json["post_id"]
    except KeyError as e:
        return jsonify({"error": f"Missing required key: {str(e)}"}), 400

    if owner_id:
        print(owner_id)
    else:
        print("no user id")

    existing_post = Post.query.filter_by(title=title).first()
    if existing_post:
        return jsonify({"error": "Post with the same title already exists for the user"}), 409

    post = Post(
        title=title,
        content=content,
        owner_id=owner_id,
        topic_id=topic_id
    )

    db.session.add(post)
    db.session.commit()

    return jsonify({
        "message": "Post created successfully.",
        "post": {
            "id": post.id,
            "title": post.title,
            "description": post.content,
            "owner_id": post.owner_id,
        },
    })

@app.route('/upvote', methods=['POST'])
@jwt_required()
def upvote_post():
    try:
        data = request.get_json()
        post_id = data.get('post_id')
        user_id = get_jwt_identity()  
        existing_post = Post.query.get(post_id)
        if existing_post:
            existing_like = UserLikes.query.filter_by(user_id=user_id, post_id=post_id).first()

            if existing_like:
                db.session.delete(existing_like)
            else:
                # Add a new upvote with like_status=True
                new_like = UserLikes(user_id=user_id, post_id=post_id, like_status=True)
                db.session.add(new_like)

            db.session.commit()

            return jsonify({'message': 'Upvote successful'}), 200

        return jsonify({'message': 'Post not found'}), 404

    except Exception as e:
        print(e)
        return jsonify({'error': 'Internal Server Error'}), 500

@app.route('/downvote', methods=['POST'])
@jwt_required()
def downvote_post():
    try:
        data = request.get_json()
        post_id = data.get('post_id')
        user_id = get_jwt_identity()

        existing_post = Post.query.get(post_id)

        if existing_post:
            existing_like = UserLikes.query.filter_by(user_id=user_id, post_id=post_id).first()

            if existing_like:
                db.session.delete(existing_like)
            else:
                new_like = UserLikes(user_id=user_id, post_id=post_id, like_status=False)
                db.session.add(new_like)

            db.session.commit()

            return jsonify({'message': 'Downvote successful'}), 200

        return jsonify({'message': 'Post not found'}), 404

    except Exception as e:
        print(e)
        return jsonify({'error': 'Internal Server Error'}), 500


@app.route("/check_vote", methods=["POST"])
@jwt_required()
def check_vote():
    try:
        data = request.get_json()
        post_id = data.get('post_id')
        user_id = get_jwt_identity()

        existing_post = Post.query.get(post_id)

        if existing_post:
            existing_like = UserLikes.query.filter_by(user_id=user_id, post_id=post_id).first()

            if existing_like:
                if existing_like.like_status:
                    return jsonify({'vote_status': 'upvoted'}), 200
                else:
                    return jsonify({'vote_status': 'downvoted'}), 200
            else:
                return jsonify({'vote_status': 'none'}), 200

        return jsonify({'message': 'Post not found'}), 404

    except Exception as e:
        print(e)
        return jsonify({'error': 'Internal Server Error'}), 500


@app.route("/delete_post", methods=["POST"])
@jwt_required()
def delete_post_route():
    try:
        user_id = get_jwt_identity()
        post_id = request.json["post_id"]
        print("this is the user id: ", user_id)
        print("this is the post id: ", post_id)
    except KeyError as e:
        return jsonify({"error": f"Missing required key: {str(e)}"}), 400

    user_post = Post.query.filter_by(owner_id=user_id, id=post_id).first()

    if user_post:
        db.session.delete(user_post)

        UserLikes.query.filter_by(post_id=post_id).update({UserLikes.post_id: None})

        db.session.commit()
        return jsonify({"message": "User successfully deleted this post"}), 200
    else:
        return jsonify({"message": "Error during deletion of post"}), 400
