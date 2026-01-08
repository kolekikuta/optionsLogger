from flask import Flask
from dotenv import load_dotenv
import os
from flask_cors import CORS
import datetime

from database import db
from routes.positions_routes import positions_blueprint
from routes.ticker_history_routes import ticker_history_blueprint
from routes.folders_routes import folders_blueprint


def create_app():
    app = Flask(__name__)
    load_dotenv()
    DATABASE_URI = os.getenv("DATABASE_URI")
    app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URI

    CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)
    db.init_app(app)

    app.register_blueprint(positions_blueprint, url_prefix="/api")
    # app.register_blueprint(users_blueprint, url_prefix="/api")
    app.register_blueprint(ticker_history_blueprint, url_prefix="/api")
    app.register_blueprint(folders_blueprint, url_prefix="/api")


    return app




if __name__ == "__main__":
    app = create_app()

    with app.app_context():
        db.create_all()

    app.run(debug=True)
