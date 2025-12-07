from database import db
import uuid
from datetime import date

class Positions(db.Model):
    __tablename__ = "positions"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), nullable=False)
    contract_symbol = db.Column(db.String, nullable=False)
    ticker = db.Column(db.String(10), nullable=False)
    contract_type = db.Column(db.String(10), nullable=False)
    strike = db.Column(db.Float, nullable=False)
    quantity = db.Column(db.Integer, default=1)
    expiration_date = db.Column(db.Date, nullable=False)
    entry_date = db.Column(db.Date, nullable=False)
    entry_price = db.Column(db.Float, nullable=False)
    entry_premium = db.Column(db.Float, nullable=False)
    exit_date = db.Column(db.Date)
    exit_price = db.Column(db.Float)
    exit_premium = db.Column(db.Float)
    profit_loss = db.Column(db.Float, default=0)
