from database import db
import uuid

class Users(db.Model):
    __tablename__ = "users"

    id = db.Column(db.String, primary_key=True, default=lambda: str(uuid.uuid4()))
    username = db.Column(db.String, unique=True, nullable=False)
    email = db.Column(db.String, nullable=False)

    positions = db.relationship("Positions", backref="user", lazy=True)