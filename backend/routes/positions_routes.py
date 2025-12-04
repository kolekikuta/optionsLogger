from flask import Blueprint, request, jsonify
from database import db
from models.positions import Positions
from datetime import date
import yfinance as yf

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

    # Default
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
        user_id=data["user_id"],
        ticker=data["ticker"],
        entry_date=date.fromisoformat(data["entry_date"]),
        expiration_date=expiration,
        type=contract_type,
        strike=strike,
        profit_loss=data.get("profit_loss")
    )

    db.session.add(new_position)
    db.session.commit()

    return {
        "status": "created",
        "contract_symbol": contract_symbol,
        "position_id": new_position.id
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