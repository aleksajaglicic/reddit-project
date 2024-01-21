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


@app.route("/check_comment_vote", methods=["POST"])
@jwt_required()
def check_comment_vote():
    try:
        data = request.get_json()
        comment_id = data.get('comment_id')
        user_id = get_jwt_identity()

        # Check if the comment with the given ID exists
        existing_comment = Comment.query.get(comment_id)

        if existing_comment:
            # Check if the user has already liked or disliked the comment
            existing_like = UserLikes.query.filter_by(user_id=user_id, comment_id=comment_id).first()

            if existing_like:
                # User has liked or disliked the comment
                if existing_like.like_status:
                    return jsonify({'vote_status': 'upvoted'}), 200
                else:
                    return jsonify({'vote_status': 'downvoted'}), 200
            else:
                # User has not liked or disliked the comment
                return jsonify({'vote_status': 'none'}), 200

        return jsonify({'message': 'Comment not found'}), 404

    except Exception as e:
        print(e)
        return jsonify({'error': 'Internal Server Error'}), 500


@app.route("/create_comment", methods=["POST"])
@jwt_required()
def create_comment():
    try:
        user_id = get_jwt_identity()
        text = request.json.get("text")  # Use .get() to handle missing keys
        post_id = request.json.get("post_id")
        topic_id = request.json.get("topic_id")

        if not all((user_id, text, post_id, topic_id)):
            return jsonify({"error": "Missing required data"}), 400

        comment = Comment(
            text=text,
            user_id=user_id,
            post_id=post_id,
            topic_id=topic_id
        )

        db.session.add(comment)
        db.session.commit()

        # Optionally, you can send a notification to the user or perform other actions

        return jsonify({
            "message": "Comment created successfully.",
            "comment": {
                "id": comment.id,
                "text": comment.text,
                "user_id": comment.user_id,
                "post_id": comment.post_id,
            },
        }), 201

    except SQLAlchemyError as e:
        db.session.rollback()
        app.logger.error(f"Database error: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500
    except Exception as e:
        app.logger.error(f"Internal server error: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

@app.route("/upvote_comment", methods=["POST"])
@jwt_required()
def upvote_comment_route():
    try:
        data = request.get_json()
        post_id = data.get('post_id')
        comment_id = data.get('comment_id')  # Add support for comment_id
        user_id = get_jwt_identity()

        # Check if it's a post or comment
        if post_id:
            existing_item = Post.query.get(post_id)
        elif comment_id:
            existing_item = Comment.query.get(comment_id)
        else:
            return jsonify({'message': 'Invalid request'}), 400

        if existing_item:
            existing_like = UserLikes.query.filter_by(user_id=user_id, post_id=post_id, comment_id=comment_id).first()

            if existing_like:
                db.session.delete(existing_like)
            else:
                new_like = UserLikes(user_id=user_id, post_id=post_id, comment_id=comment_id, like_status=True)
                db.session.add(new_like)

            db.session.commit()

            return jsonify({'message': 'Upvote successful'}), 200

        return jsonify({'message': 'Item not found'}), 404

    except Exception as e:
        print(e)
        return jsonify({'error': 'Internal Server Error'}), 500

@app.route("/downvote_comment", methods=["POST"])
@jwt_required()
def downvote_comment_route():
    try:
        data = request.get_json()
        comment_id = data.get('comment_id')
        user_id = get_jwt_identity()

        existing_like = UserLikes.query.filter_by(user_id=user_id, comment_id=comment_id).first()

        if existing_like:
            db.session.delete(existing_like)
        else:
            new_like = UserLikes(user_id=user_id, comment_id=comment_id, like_status=False)
            db.session.add(new_like)

        db.session.commit()

        return jsonify({'message': 'Downvote successful'}), 200

    except Exception as e:
        print(e)
        import traceback
        traceback.print_exc()
        return jsonify({'error': 'Internal Server Error'}), 500
