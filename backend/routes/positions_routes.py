from flask import Blueprint, request, jsonify
from database import db
from models.positions import Positions
from datetime import date
import yfinance as yf
from .utils_auth import get_user_id_from_request

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
    contract_type = data["contract_type"].lower()
    user_id = get_user_id_from_request()

    contract_symbol = None
    expiration = None
    strike = None

    if contract_type in ("call", "put"):
        expiration = date.fromisoformat(data["expiration_date"])
        strike = float(data["strike"])

        contract_symbol = build_contract_symbol(
            ticker=data["ticker"],
            expiration_date=expiration,
            option_type=contract_type,
            strike=strike
        )

    elif contract_type == "shares":
        contract_symbol = data["ticker"].upper()

    new_position = Positions(
        contract_symbol=contract_symbol,
        user_id=user_id,
        ticker=data["ticker"],
        contract_type=contract_type,
        strike=strike,
        quantity=data.get("quantity", 1),
        expiration_date=expiration,
        entry_date=date.fromisoformat(data["entry_date"]),
        entry_price=data["entry_price"],
        entry_premium=data["entry_premium"],
        exit_date=date.fromisoformat(data["exit_date"]) if data.get("exit_date") else None,
        exit_price=data.get("exit_price"),
        exit_premium=data.get("exit_premium"),
        profit_loss=data.get("profit_loss")
    )

    db.session.add(new_position)
    db.session.commit()

    return {
        "status": "created",
        "id": new_position.id
    }

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
    positions = Positions.query.filter_by(user_id=user_id).all()
    today = date.today()

    positions_list = []
    for pos in positions:
        expiration = None
        if pos.expiration_date:
            if isinstance(pos.expiration_date, str):
                expiration = date.fromisoformat(pos.expiration_date)
            else:
                expiration = pos.expiration_date
        if expiration and expiration >= today:
            dte = (expiration - today).days
        else:
            dte = None

        positions_list.append({
            "id": pos.id,
            "contract_symbol": pos.contract_symbol,
            "ticker": pos.ticker,
            "contract_type": pos.contract_type,
            "strike": pos.strike,
            "quantity": pos.quantity,
            "expiration_date": pos.expiration_date.isoformat(),
            "entry_date": pos.entry_date.isoformat(),
            "entry_price": pos.entry_price,
            "entry_premium": pos.entry_premium,
            "exit_date": pos.exit_date.isoformat() if pos.exit_date else None,
            "exit_price": pos.exit_price if pos.exit_price else None,
            "exit_premium": pos.exit_premium if pos.exit_premium else None,
            "profit_loss": pos.profit_loss,
            "dte": dte
        })

    return jsonify(positions_list)
