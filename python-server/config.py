from os import environ
from datetime import timedelta

class ApplicationConfig:   
    #SECRET_KEY = os.environ["SECRET_KEY"]
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = True
    SQLALCHEMY_DATABASE_URI = environ.get('DB_URL')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=15)
    JWT_SECRET_KEY = "lasdkmnl1k234ndnlskan"
    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USE_SSL = False
    MAIL_USERNAME = 'akisamja10@gmail.com'
    MAIL_PASSWORD = 'lqnr dabs heff fqfb'  # Replace with the generated App Password
    MAIL_DEFAULT_SENDER = 'akisamja10@gmail.com'