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

# db = SQLAlchemy()

def get_uuid():
    return uuid4().hex

app = Flask(__name__)
CORS(app)
app.config.from_object(ApplicationConfig)
app.url_map.strict_slashes = False
jwt = JWTManager(app)
bcrypt = Bcrypt(app)
db.init_app(app)
init_db(app)

mail = Mail()
mail.init_app(app)

executor = ThreadPoolExecutor()

# user_notifications = {}
# user_notifications_lock = threading.Lock()

with app.app_context():
    db.create_all()

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

### USER REGISTRATION ###

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

@app.after_request
def refresh_expiring_jwts(response):
    try:
        exp_timestamp = get_jwt()["exp"]
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
        if target_timestamp > exp_timestamp:
            access_token = create_access_token(identity=get_jwt_identity())
            data = response.get_json()
            if type(data) is dict:
                data["access_token"] = access_token 
                response.data = json.dumps(data)
        return response
    except (RuntimeError, KeyError):
        return response

### USER LOGIN ###

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

### PROFILE ###

@app.route("/profile", methods=["GET"])
@jwt_required()
def user_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    topics = Topic.query.filter_by(user_id=user_id).all()
    posts = Post.query.filter_by(user_id=user_id).all()
    comments = Comment.query.filter_by(user_id=user_id).all()

    topics_data = [{"id": topic.id, "title": topic.title, "content": topic.content} for topic in topics]
    posts_data = [{"id": post.id, "content": post.content} for post in posts]
    comments_data = [{"id": comment.id, "content": comment.content} for comment in comments]

    return jsonify({
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
        },
        "topics": topics_data,
        "posts": posts_data,
        "comments": comments_data,
    })

### ROUTES ###
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

    #owner_id = get_jwt_identity()
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
        user_id = get_jwt_identity()  # Replace with the actual way you get the user ID from the request
        print(user_id)
        # Check if the post with the given ID exists
        existing_post = Post.query.get(post_id)
        # print("/////////////////USER LIKES FOR POST:", existing_post.num_likes)
        if existing_post:
            # Check if the user has already liked the post
            existing_like = UserLikes.query.filter_by(user_id=user_id, post_id=post_id).first()

            if existing_like:
                # User already liked the post, so remove the like
                db.session.delete(existing_like)
            else:
                # User has not liked the post, so add the like
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

        # Check if the post with the given ID exists
        existing_post = Post.query.get(post_id)

        if existing_post:
            # Check if the user has already liked the post
            existing_like = UserLikes.query.filter_by(user_id=user_id, post_id=post_id).first()

            if existing_like:
                # User has already liked the post, so remove the like
                db.session.delete(existing_like)
            else:
                # User has not liked the post, so add the like with like_status=False for downvote
                new_like = UserLikes(user_id=user_id, post_id=post_id, like_status=False)
                db.session.add(new_like)

            db.session.commit()

            return jsonify({'message': 'Downvote successful'}), 200

        return jsonify({'message': 'Post not found'}), 404

    except Exception as e:
        print(e)
        return jsonify({'error': 'Internal Server Error'}), 500

@app.route("/<int:page>/<int:per_page>", methods=["GET"])
def home_posts_infinite(page=1, per_page=4):
    posts = posts.paginate(page=page, per_page=per_page)
    
    return jsonify({
        'total': total,
        'page': page,
        'per_page': per_page,
        'data': [{
            'id': p.id,
            'fullname': p.name,
            'email': p.email,
            'password': p.password,
            'photo': p.photo
        } for p in posts.items]
    })

@app.route("/", methods=["GET"])
def get_random_posts():
    try:
        page = request.args.get('page', 1, type=int)
        per_page = 4

        posts = (
            db.session.query(Post)
            .paginate(page=page, per_page=per_page, error_out=False)
        )

        formatted_posts = [
            {
                "id": post.id,
                "title": post.title,
                "owner_id": post.owner_id,
                "topic_id": post.topic_id,
                "content": post.content,
                "num_likes": post.num_likes,
                "num_comments": post.num_comments,
                "timestamp": post.timestamp,
                "owner_name": post.owner_name,
                "topic_name": post.topic_name
            }
            for post in posts.items
        ]

        response_data = {
            "posts": formatted_posts,
            "has_next": posts.has_next,
        }

        return jsonify(response_data)

    except Exception as e:
        print(e)
        return jsonify({"error": "Internal Server Error"}), 500

@app.route("/pr/<string:title>", methods=["GET"])
def topic_page(title):
    try:
        topic = db.session.query(Topic).filter_by(title=title).first()

        if not topic:
            return jsonify({"error": "no topic found"})

        page = request.args.get('page', 1, type=int)
        per_page = 4

        posts = (
            db.session.query(Post)
            .filter_by(topic_id=topic.id)
            .distinct(Post.id)
            .order_by(Post.id, Post.timestamp.desc())
            .paginate(page=page, per_page=per_page, error_out=False)
        )

        formatted_posts = [
            {
                "id": post.id,
                "title": post.title,
                "owner_id": post.owner_id,
                "topic_id": post.topic_id,
                "content": post.content,
                "num_likes": post.num_likes,
                "num_comments": post.num_comments,
                "timestamp": post.timestamp,
                "owner_name": post.owner_name,
                "topic_name": post.topic_name
            }
            for post in posts.items
        ]

        response_data = {
            "topic": {
                "id": topic.id,
                "title": topic.title,
                "description": topic.description,
            },
            "posts": formatted_posts,
            "has_next": posts.has_next,
        }

        return jsonify(response_data)

    except Exception as e:
        print(e)
        return jsonify({"error": "Internal Server Error"}), 500

@app.route("/pr/<string:title>/<string:post_id>", methods=["GET"])
def get_post_and_comments(title, post_id):
    try:
        topic = db.session.query(Topic).filter_by(title=title).first()

        if not topic:
            return jsonify({"error": "No topic found"}), 404

        post = db.session.query(Post).filter_by(id=post_id, topic_id=topic.id).first()

        if not post:
            return jsonify({"error": "No post found"}), 404

        comments = (
            db.session.query(Comment)
            .filter_by(post_id=post.id)
            .order_by(Comment.timestamp.desc())
            .all()
        )

        formatted_comments = [
            {
                "id": comment.id,
                "text": comment.text,
                "user_id": comment.user_id,
                "post_id": comment.post_id,
                "timestamp": comment.timestamp,
                "owner_name": comment.owner_name,
                # Add other fields as needed
            }
            for comment in comments
        ]

        response_data = {
            "post": {
                "id": post.id,
                "title": post.title,
                "owner_id": post.owner_id,
                "topic_id": post.topic_id,
                "content": post.content,
                "num_likes": post.num_likes,
                "num_comments": post.num_comments,
                "timestamp": post.timestamp,
                "owner_name": post.owner_name,
                "topic_name": post.topic_name,
            },
            "comments": formatted_comments,
        }

        return jsonify(response_data), 200

    except SQLAlchemyError as e:
        db.session.rollback()
        app.logger.error(f"Database error: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500
    except Exception as e:
        app.logger.error(f"Internal server error: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500


@app.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200

@app.route("/logout", methods=["POST"])
def logout():
    response = jsonify({"message": "logout succesful"})
    unset_jwt_cookies(response)
    return response

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
    comment_id = request.json["comment_id"]

    existing_comment = Comment.query.filter_by(id = comment_id).first()

    return upvote_comment(comment_id)

@app.route("/downvote_comment", methods=["POST"])
@jwt_required()
def downvote_comment_route():
    comment_id = request.json["comment_id"]
    return downvote_comment(comment_id)

@app.route("/delete_topic", methods=["POST"])
@jwt_required()
def delete_topic_route():
    try:
        user_id = get_jwt_identity();
        topic_id = request.json["topic_id"]
        print("this is the user id: ", user_id);
        print("this is the topic id: ", topic_id)
    except KeyError as e:
        return jsonify({"error": f"Missing required key: {str(e)}"}), 400

    user_topic = Topic.query.filter_by(owner_id=user_id, id=topic_id).first()

    if user_topic:
        for post in Post.query.filter_by(owner_id=user_id, topic_id=topic_id).distinct(Post.id):
            db.session.delete(post)
        db.session.delete(user_topic)
        db.session.commit()
        return jsonify({"message": "User successfully deleted this topic"}), 200
    else:
        return jsonify({"message": "Error during deletion of topic"}), 400

    #new_subscription = UserSubscriptions(user_id=user_id, topic_id=topic_id)
    #db.session.add(new_subscription)

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


@app.route("/sort_search_topics", methods=["POST"])
@jwt_required()
def sort_search_topics_route():
    sort_type = request.json.get("sort_type", "default")
    search_query = request.json.get("search_query", "")
    topics_data = sort_search_topics(sort_type, search_query)
    return jsonify({"topics": topics_data})

@app.route("/test", methods=["GET"])
def test():
    return make_response(jsonify({'message': 'test-route'}), 200)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)