"""
from flask import Blueprint, request
from database import db
from models.users import Users

users_blueprint = Blueprint("users", __name__)

@users_blueprint.route("/users/create", methods=["POST"])
def create_user():
    data = request.json

    new_user = Users(
        username=data["username"],
        email=data["email"]
    )

    db.session.add(new_user)
    db.session.commit()

    return {"status" : "created", "user_id": new_user.id}
"""