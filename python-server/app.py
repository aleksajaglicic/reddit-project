import threading
import smtplib
import datetime
from flask import Flask, jsonify, request, abort, make_response, render_template, session, Blueprint, copy_current_request_context
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager
from flask_jwt_extended import unset_jwt_cookies
from models.user import db, User
from config import ApplicationConfig
from flask_sqlalchemy import SQLAlchemy
from uuid import uuid4

db = SQLAlchemy()

def get_uuid():
    return uuid4().hex

class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid())
    name = db.Column(db.String(32), unique=False, nullable=False)
    last_name = db.Column(db.String(32), unique=False, nullable=False)
    address = db.Column(db.String(32), unique=False)
    city = db.Column(db.String(32), unique=False)
    phone_number = db.Column(db.String(48), unique=True)
    email = db.Column(db.String(345), unique=True, nullable=False)
    password = db.Column(db.Text, nullable=False)


app = Flask(__name__)
CORS(app)
app.config.from_object(ApplicationConfig)
app.url_map.strict_slashes = False
jwt = JWTManager(app)

bcrypt = Bcrypt(app)
db.init_app(app)

with app.app_context():
    db.create_all()

def send_confirmation_email(email):
    # Simulating sending a confirmation email
    print(f"Sending confirmation email to {email}")
    # Your email sending logic goes here

def register_user_in_thread(name, last_name, address, city, phone_number, email, password):
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(name=name, last_name=last_name, address=address, city=city, phone_number=phone_number, email=email, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    # Trigger email confirmation in a separate thread
    user_thread = threading.Thread(target=send_confirmation_email, args=(email,))
    user_thread.start()

@app.route("/register", methods=["POST"])
def register_user():
    name = request.json["name"]
    last_name = request.json["last_name"]
    address = request.json["address"]
    city = request.json["city"]
    phone_number = request.json["phone_number"]
    email = request.json["email"]
    password = request.json["password"]

    user_exists = User.query.filter_by(email=email).first()

    if user_exists:
        return jsonify({"error": "A user already exists with that email."}), 409

    # hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    # new_user = User(name=name, last_name=last_name, address=address, city=city, phone_number=phone_number, email=email, password=hashed_password)
    # db.session.add(new_user)
    # db.session.commit()

    register_thread = threading.Thread(target=register_user_in_thread, args=(name, last_name, address, city, phone_number, email, password))
    register_thread.start()
    
    #print(f"new_user.password: {new_user.password}")
    # user_thread = threading.Thread(target=send_confirmation_email, args=(email,))
    # user_thread.start()

    # return jsonify({
    #     "id": new_user.id,
    #     "name": new_user.name,
    #     "email": new_user.email
    # })

    return jsonify({
        "message": "Registration in progress. Confirmation email will be sent shortly."
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
        # Case where there is not a valid JWT. Just return the original respone
        return response

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
    
# @app.route("/login", methods=["POST"])
# def login_user():
#     email = request.json["email"]
#     password = request.json["password"]
#     # print(f"Received login request for email: {email}")
#     # user = User.query.filter_by(email=email).first()

#     # if user is None:
#     #     return jsonify({"error": "Unathorized"}), 401
#     # if not brcypt.check_password_hash(user.password, password):
#     #     return jsonify({"error": "Bad username or password"}), 401
    
#     # access_token = create_access_token(identity=user.id)
#     # return jsonify(access_token=access_token, user={"id": user.id, "email": user.email})
#     login_thread = threading.Thread(target=login_user_in_thread, args=(email, password))
#     login_thread.start()

#     return jsonify({
#         "message": "Login in progress. Please wait."
#     })

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

@app.route("/test", methods=["GET"])
def test():
    return make_response(jsonify({'message': 'test-route'}), 200)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)