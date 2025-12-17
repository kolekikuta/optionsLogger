from flask import Blueprint, request, jsonify
from database import db
from models.ticker_history import Ticker_History
from datetime import date
import yfinance as yf
import pandas as pd


ticker_history_blueprint = Blueprint("ticker", __name__)

@ticker_history_blueprint.route("/ticker/history", methods=["GET"])
def get_ticker_history():
    symbol = request.args.get("symbol")
    start = request.args.get("start")
    end = request.args.get("end")

    query = Ticker_History.query.filter_by(ticker=symbol)

    if start:
        query = query.filter(Ticker_History.date >= start)

    if end:
        query = query.filter(Ticker_History.date <= end)

    rows = query.order_by(Ticker_History.date.asc()).all()

    data = [
        {
            "date": row.date.isoformat(),
            "open": row.open,
            "close": row.close,
            "high": row.high,
            "low": row.low,
            "volume": row.volume
        }
        for row in rows
    ]


    return jsonify(data)

@ticker_history_blueprint.route("/ticker/pop", methods=["POST"])
def backfill_ticker():
    TICKERS = ["SPY", "AAPL", "NVDA"]

    for ticker in TICKERS:
        df = yf.download(ticker, period="max", auto_adjust=False)
        df = df.reset_index()

        if isinstance(df.columns, pd.MultiIndex):
            df.columns = df.columns.get_level_values(0)

        rows = []
        for row in df.itertuples(index=False):
            rows.append(
                Ticker_History(
                    ticker=ticker,
                    date=row.Date.date(),
                    open=row.Open,
                    high=row.High,
                    low=row.Low,
                    close=row.Close,
                    volume=int(row.Volume) if row.Volume is not None else None,
                )
            )

        db.session.bulk_save_objects(rows)
        db.session.commit()

    return {"status": "ok"}