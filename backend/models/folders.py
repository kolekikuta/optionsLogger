from database import db
import uuid

class Folders(db.Model):
    __tablename__ = "folders"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), nullable=False)
    name = db.Column(db.String, nullable=False)
