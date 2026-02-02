from flask import Blueprint, request, jsonify
from database import db
from models.positions import Positions
from datetime import date
import yfinance as yf
from .utils_auth import get_user_id_from_request
from models.folder_positions import FolderPositions
from models.folders import Folders

positions_blueprint = Blueprint("positions", __name__)

def build_contract_symbol(ticker, expiration_date, option_type, strike):
    y = str(expiration_date.year)[2:]
    m = f"{expiration_date.month:02d}"
    d = f"{expiration_date.day:02d}"

    cp = "C" if option_type.lower() == "call" else "P"
    strike_formatted = f"{int(float(strike) * 1000):08d}"

    return f"{ticker.upper()}{y}{m}{d}{cp}{strike_formatted}"

@positions_blueprint.route("/positions/create", methods=["POST"])
def create_position():
    data = request.json
    user_id = get_user_id_from_request()
    contract_type = data["contract_type"].lower()

    contract_symbol = None
    expiration = None
    strike = None
    profit_loss = 0
    profit_loss_percent = 0

    quantity = int(data.get("quantity", 1))

    # -----------------
    # OPTIONS
    # -----------------
    if contract_type in ("call", "put"):
        expiration = date.fromisoformat(data["expiration_date"])
        strike = float(data["strike"])

        contract_symbol = build_contract_symbol(
            ticker=data["ticker"],
            expiration_date=expiration,
            option_type=contract_type,
            strike=strike
        )

        if data.get("entry_premium") and data.get("exit_premium"):
            entry_premium = float(data["entry_premium"])
            exit_premium = float(data["exit_premium"])

            profit_loss = (exit_premium - entry_premium) * quantity * 100
            cost_basis = entry_premium * quantity * 100

            if cost_basis > 0:
                profit_loss_percent = round(
                    (profit_loss / cost_basis) * 100,
                    2
                )

    # -----------------
    # SHARES
    # -----------------
    elif contract_type == "shares":
        contract_symbol = data["ticker"].upper()

        if data.get("entry_price") and data.get("exit_price"):
            entry_price = float(data["entry_price"])
            exit_price = float(data["exit_price"])

            profit_loss = (exit_price - entry_price) * quantity

            if entry_price * quantity > 0:
                profit_loss_percent = round(
                    (profit_loss / (entry_price * quantity)) * 100,
                    2
                )

    else:
        return jsonify({"error": "Invalid contract type"}), 400

    new_position = Positions(
        contract_symbol=contract_symbol,
        user_id=user_id,
        ticker=data["ticker"],
        contract_type=contract_type,
        strike=strike,
        quantity=quantity,
        expiration_date=expiration,
        entry_date=date.fromisoformat(data["entry_date"]),
        entry_price=data.get("entry_price"),
        entry_premium=data.get("entry_premium"),
        exit_date=date.fromisoformat(data["exit_date"]) if data.get("exit_date") else None,
        exit_price=data.get("exit_price"),
        exit_premium=data.get("exit_premium"),
        profit_loss=profit_loss,
        profit_loss_percent=profit_loss_percent,
    )

    db.session.add(new_position)
    db.session.commit()

    return jsonify({
        "status": "created",
        "id": new_position.id
    })

@positions_blueprint.route("/validate_ticker", methods=["GET"])
def validate_ticker():
    symbol = request.args.get("symbol", "").upper()

    if not symbol:
        return jsonify({"valid": False, "reason": "No symbol provided"}), 400

    ticker = yf.Ticker(symbol)
    info = ticker.fast_info

    if not info or "lastPrice" not in info:
        return jsonify({"valid": False})

    return jsonify({"valid": True})

@positions_blueprint.route("/positions", methods=["GET"])
def get_positions():
    user_id = get_user_id_from_request()
    folder_ids_param = request.args.get("folder_ids")

    query = db.session.query(Positions).filter(Positions.user_id == user_id)

    if folder_ids_param is not None:
        # folder_ids was provided (even if empty)
        if folder_ids_param.strip() == "":
            # Explicitly no folders selected -> return no positions
            return jsonify([])

        try:
            folder_ids = [x.strip() for x in folder_ids_param.split(",") if x.strip()]
        except ValueError:
            return jsonify({"error": "Invalid folder_ids parameter"}), 400

        query = (
            query
            .join(FolderPositions, Positions.id == FolderPositions.position_id)
            .filter(FolderPositions.folder_id.in_(folder_ids))
            .distinct()
        )

    positions = query.all()
    today = date.today()
    positions_list = []

    for pos in positions:
        expiration = None
        if pos.expiration_date:
            expiration = (
                date.fromisoformat(pos.expiration_date)
                if isinstance(pos.expiration_date, str)
                else pos.expiration_date
            )

        dte = (
            (expiration - today).days
            if expiration and not pos.exit_date and expiration >= today
            else None
        )

        positions_list.append({
            "id": pos.id,
            "contract_symbol": pos.contract_symbol,
            "ticker": pos.ticker,
            "contract_type": pos.contract_type,
            "strike": pos.strike,
            "quantity": pos.quantity,
            "expiration_date": pos.expiration_date.isoformat() if pos.expiration_date else None,
            "entry_date": pos.entry_date.isoformat(),
            "entry_price": pos.entry_price,
            "entry_premium": pos.entry_premium,
            "exit_date": pos.exit_date.isoformat() if pos.exit_date else None,
            "exit_price": pos.exit_price if pos.exit_price else None,
            "exit_premium": pos.exit_premium if pos.exit_premium else None,
            "profit_loss": pos.profit_loss,
            "profit_loss_percent": pos.profit_loss_percent,
            "dte": dte,
            "entry_total": pos.entry_premium * pos.quantity * 100,
            "entry_amount": f"{pos.quantity} @ ${pos.entry_premium:.2f}",
            "exit_total": (
                pos.exit_premium * pos.quantity * 100
                if pos.exit_premium else None
            ),
        })

    return jsonify(positions_list)


@positions_blueprint.route("/positions/<string:position_id>", methods=["DELETE"])
def delete_position(position_id):
    user_id = get_user_id_from_request()
    position = Positions.query.filter_by(id=position_id, user_id=user_id).first()

    if not position:
        return jsonify({"error": "Position not found"}), 404

    db.session.delete(position)
    db.session.commit()

    return jsonify({"status": "deleted"})

@positions_blueprint.route("/positions/<string:position_id>", methods=["PUT", "OPTIONS"])
def update_position(position_id):
    user_id = get_user_id_from_request()
    position = Positions.query.filter_by(id=position_id, user_id=user_id).first()

    if not position:
        return jsonify({"error": "Position not found"}), 404

    data = request.json

    for key, value in data.items():
        if hasattr(position, key):
            setattr(position, key, value)

    db.session.commit()

    return jsonify({"status": "updated"})

# get all folders for a position
@positions_blueprint.route("/positions/<string:position_id>/folders", methods=["GET"])
def get_position_folders(position_id):
    user_id = get_user_id_from_request()
    position = Positions.query.filter_by(id=position_id, user_id=user_id).first()

    if not position:
        return jsonify({"error": "Position not found"}), 404

    folders = (
        db.session.query(Folders)
        .join(FolderPositions, Folders.id == FolderPositions.folder_id)
        .filter(FolderPositions.position_id == position_id)
        .all()
    )

    folders_list = [
        {
            "id": folder.id,
            "user_id": folder.user_id,
            "name": folder.name
        }
        for folder in folders
    ]

    return jsonify(folders_list), 200

# update a position's folders
@positions_blueprint.route("/positions/<string:position_id>/folders", methods=["PUT"])
def update_position_folders(position_id):
    data = request.json
    user_id = get_user_id_from_request()
    position = Positions.query.filter_by(id=position_id, user_id=user_id).first()

    if not position:
        return jsonify({"error": "Position not found"}), 404

    new_folder_ids = data.get("folder_ids", [])

    # Remove existing associations
    FolderPositions.query.filter_by(position_id=position_id).delete()

    # Add new associations
    for folder_id in new_folder_ids:
        new_association = FolderPositions(
            folder_id=folder_id,
            position_id=position_id
        )
        db.session.add(new_association)

    db.session.commit()

    return jsonify({"status": "updated"}), 200
