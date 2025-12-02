from flask import Blueprint, request, jsonify
from database import db
from models.ticker_history import Ticker_History
from ticker import download_ticker
from datetime import date


ticker_history_blueprint = Blueprint("ticker", __name__)

@ticker_history_blueprint.route("/ticker/history", methods=["GET"])
def get_ticker_history():
    symbol = request.args.get("symbol")
    start = request.args.get("start")
    end = request.args.get("end")

    query = Ticker_History.query.filter_by(ticker=symbol)

    if start:
        query.filter(Ticker_History.date >= start)

    if end:
        query.filter(Ticker_History.date <= end)

    rows = query.order_by(Ticker_History.date.asc()).all()

    data = [
        {
            "date": row.date.isoformat(),
            "open": row.open,
            "close": row.close,
            "high": row.high,
            "low": row.low
        }
        for row in rows
    ]


    return jsonify(data)