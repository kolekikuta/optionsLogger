from database import db
import uuid

class Ticker_History(db.Model):
    __tablename__ = "ticker_history"

    id = db.Column(db.String, primary_key=True, default=lambda: str(uuid.uuid4()))
    ticker = db.Column(db.String, nullable=False)
    date = db.Column(db.Date, nullable=False)
    open = db.Column(db.Float, nullable=False)
    close = db.Column(db.Float, nullable=False)
    high = db.Column(db.Float, nullable=False)
    low = db.Column(db.Float, nullable=False)