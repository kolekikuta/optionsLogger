import yfinance as yf
import pandas as pd

def download_ticker(ticker, start_date, end_date):
    try:
        tckr = yf.Ticker(ticker=ticker)
        df = tckr.history(start=start_date, end=end_date)

    except Exception as e:
        print(f"Error fetching data for {ticker}: {e}")
        return pd.DataFrame()

    return df
