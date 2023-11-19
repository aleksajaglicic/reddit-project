from os import environ

class ApplicationConfig:   
    #SECRET_KEY = os.environ["SECRET_KEY"]
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = True
    SQLALCHEMY_DATABASE_URI = environ.get('DB_URL')
    
    JWT_SECRET_KEY = "lasdkmnl1k234ndnlskan"