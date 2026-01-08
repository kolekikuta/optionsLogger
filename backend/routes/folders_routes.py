from flask import Blueprint, request, jsonify
from database import db
from models.folder_positions import FolderPositions
from models.folders import Folders
from .utils_auth import get_user_id_from_request

folders_blueprint = Blueprint("folders", __name__)

# Create Folder
@folders_blueprint.route("/folders/create", methods=["POST"])
def create_folder():
    data = request.json
    user_id = get_user_id_from_request()
    folder_name = data.get("name")

    if not folder_name:
        return jsonify({"error": "Folder name is required"}), 400

    new_folder = Folders(
        user_id=user_id,
        name=folder_name
    )

    db.session.add(new_folder)
    db.session.commit()

    return jsonify({
        "id": new_folder.id,
        "user_id": new_folder.user_id,
        "name": new_folder.name
    }), 201

# Get all folders for a user
@folders_blueprint.route("/folders", methods=["GET"])
def get_folders():
    user_id = get_user_id_from_request()
    folders = Folders.query.filter_by(user_id=user_id).all()

    folders_list = [
        {
            "id": folder.id,
            "user_id": folder.user_id,
            "name": folder.name
        }
        for folder in folders
    ]

    return jsonify(folders_list), 200

# Update Folder Name
@folders_blueprint.route("/folders/<folder_id>/update", methods=["PUT"])
def update_folder(folder_id):
    data = request.json
    user_id = get_user_id_from_request()
    new_name = data.get("name")

    folder = Folders.query.filter_by(id=folder_id, user_id=user_id).first()
    if not folder:
        return jsonify({"error": "Folder not found"}), 404

    if not new_name:
        return jsonify({"error": "New folder name is required"}), 400

    folder.name = new_name
    db.session.commit()

    return jsonify({
        "id": folder.id,
        "user_id": folder.user_id,
        "name": folder.name
    }), 200


# Delete Folder
@folders_blueprint.route("/folders/<folder_id>/delete", methods=["DELETE"])
def delete_folder(folder_id):
    user_id = get_user_id_from_request()

    folder = Folders.query.filter_by(id=folder_id, user_id=user_id).first()
    if not folder:
        return jsonify({"error": "Folder not found"}), 404

    # Also delete all associations in FolderPositions
    FolderPositions.query.filter_by(folder_id=folder_id).delete()

    db.session.delete(folder)
    db.session.commit()

    return jsonify({"status": "deleted"}), 200


# Move Position to Folder
@folders_blueprint.route("/folders/<folder_id>/add_position", methods=["POST"])
def add_position_to_folder(folder_id):
    data = request.json
    user_id = get_user_id_from_request()
    position_id = data.get("position_id")

    folder = Folders.query.filter_by(id=folder_id, user_id=user_id).first()
    if not folder:
        return jsonify({"error": "Folder not found"}), 404

    # Check if position exists and belongs to user
    from models.positions import Positions
    position = Positions.query.filter_by(id=position_id, user_id=user_id).first()
    if not position:
        return jsonify({"error": "Position not found"}), 404

    # Check if association already exists
    existing_association = FolderPositions.query.filter_by(folder_id=folder_id, position_id=position_id).first()
    if existing_association:
        return jsonify({"error": "Position already in folder"}), 400

    new_association = FolderPositions(
        folder_id=folder_id,
        position_id=position_id
    )

    db.session.add(new_association)
    db.session.commit()

    return jsonify({"status": "position added to folder"}), 201


# Remove Position from Folder
@folders_blueprint.route("/folders/<folder_id>/remove_position", methods=["POST"])
def remove_position_from_folder(folder_id):
    data = request.json
    user_id = get_user_id_from_request()
    position_id = data.get("position_id")

    folder = Folders.query.filter_by(id=folder_id, user_id=user_id).first()
    if not folder:
        return jsonify({"error": "Folder not found"}), 404

    association = FolderPositions.query.filter_by(folder_id=folder_id, position_id=position_id).first()
    if not association:
        return jsonify({"error": "Position not in folder"}), 404

    db.session.delete(association)
    db.session.commit()

    return jsonify({"status": "position removed from folder"}), 200
