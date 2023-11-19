import threading
import smtplib
from flask import Flask, jsonify, request, abort, make_response, render_template, session, Blueprint
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager
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

brcypt = Bcrypt(app)
db.init_app(app)

with app.app_context():
    db.create_all()

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

    hashed_password = brcypt.generate_password_hash(password).decode('utf-8')
    new_user = User(name=name, last_name=last_name, address=address, city=city, phone_number=phone_number, email=email, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    
    #print(f"new_user.password: {new_user.password}")
    # user_thread = threading.Thread(target=send_confirmation_email, args=(email,))
    # user_thread.start()

    return jsonify({
        "id": new_user.id,
        "name": new_user.name,
        "email": new_user.email
    })

@app.route("/login", methods=["POST"])
def login_user():
    email = request.json["email"]
    password = request.json["password"]
    user = User.query.filter_by(email=email).first()

    if user is None:
        return jsonify({"error": "Unathorized"}), 401
    if not brcypt.check_password_hash(user.password, password):
        return jsonify({"error": "Bad username or password"}), 401
    
    access_token = create_access_token(identity=user.id)
    return jsonify(access_token=access_token)

@app.route("/test", methods=["GET"])
def test():
    return make_response(jsonify({'message': 'test-route'}), 200)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)