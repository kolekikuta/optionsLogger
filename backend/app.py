from flask import Flask
from dotenv import load_dotenv
import os
from flask_cors import CORS
from models import db
from flask_sqlalchemy import SQLAlchemy


app = Flask(__name__)
CORS(app)

load_dotenv()

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)

    USER = os.getenv("user")
    PASSWORD = os.getenv("password")
    HOST = os.getenv("host")
    PORT = os.getenv("port")
    DBNAME = os.getenv("dbname")

    DATABASE_URL = f"postgresql+psycopg2://{USER}:{PASSWORD}@{HOST}:{PORT}/{DBNAME}?sslmode=require"

    app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URL
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.init_app(app)

    with app.app_context():
        try:
            db.session.execute("SELECT 1")
            print("Connection successful!")
        except Exception as e:
            print("Failed to connect:", e)

    return app

if __name__ == "__main__":
    app = create_app()

    with app.app_context():
        db.create_all()

    app.run(debug=True)
