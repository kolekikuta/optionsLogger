import yfinance as yf
import pandas as pd
from datetime import date
import datetime
import database as db
from models.ticker_history import Ticker_History
from app import create_app

def download_ticker(ticker, start_date, end_date):
    try:
        tckr = yf.Ticker(ticker=ticker)
        df = tckr.history(start=start_date, end=end_date)

    except Exception as e:
        print(f'Error fetching data for {ticker}: {e}')
        return pd.DataFrame()

    return df

# download the info for all current positions
def download_positions_info(contract_symbols):
    results = {}

    for contract_symbol in contract_symbols:
        try:
            tckr = yf.Ticker(contract_symbol)
            results[contract_symbol] = tckr.fast_info

        except Exception as e:
            print(f'Error fetching options chain for {contract_symbol}: {e}')
            continue

    return results

