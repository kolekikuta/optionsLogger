from flask import Blueprint, request
from database import db
from models.users import Users
from models.positions import Positions
from datetime import date

positions_blueprint = Blueprint("positions", __name__)

@positions_blueprint.route("/positions/create", methods=["POST"])
def create_position():
    data = request.json

    new_position = Positions(
        user_id=data["user_id"],
        ticker=data["ticker"],
        entry_date=date.fromisoformat(data["entry_date"]),
        expiration_date=date.fromisoformat(data["expiration_date"]),
        type=data["type"],
        strike=data["strike"],
        profit_loss=data.get("profit_loss")
    )

    db.session.add(new_position)
    db.session.commit()

    return {"status" : "created", "position_id": new_position.id}