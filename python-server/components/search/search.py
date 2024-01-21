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


def search_topics(search_query):
    topics = (
        Topic.query
        .filter(Topic.title.ilike(f"%{search_query}%"))
        .all()
    )

    topics_data = [{"id": topic.id, "title": topic.title} for topic in topics]
    return topics_data

@app.route("/sort_search_topics", methods=["POST"])
def sort_search_topics_route():
    try:
        sort_type = request.json.get("sort_type", "default")
        search_query = request.json.get("search_query", "")

        # Perform the search based on sort_type and search_query
        if sort_type == "default":
            # Search through topic titles using a case-insensitive query
            topics_data = search_topics(search_query)
            return jsonify({"topics": topics_data})
        else:
            # Handle other sort types if needed
            return jsonify({"error": "Invalid sort type"}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500
