import yfinance as yf
import pandas as pd
from sqlalchemy.dialects.postgresql import insert
from database import db
from models.ticker_history import Ticker_History


def download_ticker(ticker, start_date, end_date, save_to_db=True):
    """
    Download ticker history (pandas DataFrame). If save_to_db is True,
    insert missing rows into ticker_history using a Postgres upsert
    (ON CONFLICT DO NOTHING on (ticker, date)).
    """
    try:
        df = yf.download(
            ticker,
            start=start_date,
            end=end_date,
            auto_adjust=False
        )
    except Exception as e:
        print(f"Error fetching data for {ticker}: {e}")
        return pd.DataFrame()

    if df is None or df.empty:
        return pd.DataFrame()

    df = df.reset_index()

    # flatten MultiIndex columns if present
    if isinstance(df.columns, pd.MultiIndex):
        df.columns = df.columns.get_level_values(0)

    if not save_to_db:
        return df

    try:
        rows = []

        for row in df.itertuples(index=False):
            if hasattr(row, "Date"):
                row_date = row.Date.date()
            else:
                first = getattr(row, df.columns[0], None)
                row_date = first.date() if hasattr(first, "date") else None

            if row_date is None:
                continue

            rows.append({
                "ticker": ticker,
                "date": row_date,
                "open": getattr(row, "Open", None),
                "high": getattr(row, "High", None),
                "low": getattr(row, "Low", None),
                "close": getattr(row, "Close", None),
                "volume": int(getattr(row, "Volume", 0)) if getattr(row, "Volume", None) is not None else None,
            })

        if not rows:
            return df

        stmt = insert(Ticker_History).values(rows)

        stmt = stmt.on_conflict_do_nothing(
            index_elements=["ticker", "date"]
        )

        result = db.session.execute(stmt)
        db.session.commit()

        print(f"Inserted {result.rowcount} new ticker_history rows for {ticker}")

    except Exception as e:
        db.session.rollback()
        print(f"Error saving ticker history for {ticker}: {e}")

    return df


# download the info for all current positions
def download_positions_info(contract_symbols):
    results = {}

    for contract_symbol in contract_symbols:
        try:
            tckr = yf.Ticker(contract_symbol)
            results[contract_symbol] = tckr.fast_info
        except Exception as e:
            print(f"Error fetching options chain for {contract_symbol}: {e}")

    return results
