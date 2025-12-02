from database import db
import uuid
from datetime import date

class Positions(db.Model):
    __tablename__ = "positions"

    id = db.Column(db.String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String, db.ForeignKey("users.id"), nullable=False)
    ticker = db.Column(db.String, nullable=False)
    entry_date = db.Column(db.Date, nullable=False)
    expiration_date = db.Column(db.Date, nullable=False)
    exit_date = db.Column(db.Date)
    type = db.Column(db.String, nullable=False)
    strike = db.Column(db.Float, nullable=False)
    profit_loss = db.Column(db.Float)