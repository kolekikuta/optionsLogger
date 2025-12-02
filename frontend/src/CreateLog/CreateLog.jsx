import { useState } from 'react';
import axios from 'axios';
import DollarInput from '../utils/DollarInput';
import Select from 'react-select';
import CreatableSelect from "react-select/creatable";


export default function CreateLog() {

    const [log, setLog] = useState({
        ticker: null,
        entry_date: null,
        entry_price: null,
        entry_premium: null,
        expiration_date: null,
        exit_date: null,
        exit_price: null,
        exit_premium: null,
        strike: null,
        contract_type: null,
        amount: null
    });

    const [tickerInput, setTickerInput] = useState("");

    const tickers = ["AAPL", "MSFT", "GOOGL", "TSLA", "SPY", "QQQ", "AMZN"].map(t => ({
        label: t,
        value: t.toLowerCase()
    }));

    const contract_types = ["Call", "Put", "Shares"].map(t => ({
        label: t,
        value: t.toLowerCase()
    }));

    async function handleSave(e) {
        e.preventDefault();
        const backendUrl = import.meta.env.VITE_BACKEND_URL;

        let requiredFields;

        if (log.contract_type === "shares") {
            requiredFields = [
                "ticker",
                "entry_date",
                "entry_price",
                "entry_premium",
            ];
        }else {
            requiredFields = [
                "ticker",
                "entry_date",
                "entry_price",
                "entry_premium",
                "expiration_date",
                "strike",
                "amount"
            ];
        }

        const missing = requiredFields.filter(field => !log[field]);

        if(missing.length > 0){
            alert(`Please complete the following fields: ${missing.join(", ")}`);
            return;
        }

        // if any of exit date is filled, make sure the rest is filled
        const anyExit = log.exit_date || log.exit_price || log.exit_premium;
        const allExit = log.exit_date && log.exit_price && log.exit_premium;
        if (anyExit && !allExit) {
            alert("Please complete all of the exit fields");
            return;
        }

        //check that ticker exists
        const isValid = await validateTicker(log.ticker);
        if(!isValid) {
            alert("Ticker does not exist or yfinance cannot pull data for it.");
            return;
        }

        //await axios.post(`${backendUrl}/api/positions`, log);

        setLog({
            ticker: null,
            entry_date: null,
            entry_price: null,
            entry_premium: null,
            expiration_date: null,
            exit_date: null,
            exit_price: null,
            exit_premium: null,
            strike: null,
            contract_type: null,
            amount: null
        });
    }

    async function validateTicker(ticker) {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        try {
            const res = await axios.get(`${backendUrl}/validate_ticker`, {
                params: { symbol: ticker }
            });

            return res.data.valid;
        } catch (err) {
            console.error("Ticker validation failed:", err);
            return false;
        }
    }
    return (
        <>
            <form onSubmit={handleSave}>


                <div>
                    <CreatableSelect
                        options={tickers}
                        value={
                            tickers.find(t => t.value === log.ticker)
                            || (log.ticker ? { value: log.ticker, label: log.ticker } : null)
                        }
                        inputValue={tickerInput}
                        onInputChange={(inputValue, action) => {
                            if (action.action === "input-change") {
                                const filtered = inputValue.replace(/[^a-zA-Z]/g, "");
                                setTickerInput(filtered.toUpperCase());
                            }

                            if (action.action === "input-blur") {
                                setTickerInput(prev => prev.toUpperCase());
                            }

                            if (action.action === "menu-close") {
                                setTickerInput(prev => prev.toUpperCase());
                            }
                        }}
                        onChange={option => {
                            const value = option ? option.value.toUpperCase() : "";
                            setLog(prev => ({ ...prev, ticker: value }));
                            setTickerInput(value);
                        }}
                        placeholder="Ticker"
                        isSearchable={true}
                        isClearable={true}
                        formatCreateLabel={inputValue => `Use "${inputValue.toUpperCase()}"`}
                    />
                    <Select
                        options={contract_types}
                        value={contract_types.find(t => t.value === log.contract_type) || null}
                        onChange={(option) =>
                            setLog(prev => ({
                                ...prev,
                                contract_type: option.value
                            }))
                        }
                        placeholder="Type"
                        isSearchable={false}
                    />
                </div>
                {log.contract_type !== "shares" && (
                    <div>
                        <DollarInput
                            value={log.strike}
                            onChange={(e) => setLog(prev => ({...prev, strike: e}))}
                            placeholder='Strike'
                        />
                        <input
                            type="number"
                            min="1"
                            step="1"
                            placeholder='Amount'
                            value={log.amount}
                            onChange={e =>
                                setLog(prev => ({
                                    ...prev,
                                    amount: e.target.value
                                }))
                            }
                        />

                        <label>
                            Expiration Date:
                            <input
                                type='date'
                                placeholder='Expiration'
                                value={log.expiration_date}
                                min={log.entry_date || ""}
                                max={log.exit_date || ""}
                                onChange={e =>
                                    setLog(prev => ({
                                        ...prev,
                                        expiration_date: e.target.value
                                    }))
                                }
                            />
                        </label>
                    </div>
                )}
                <div>
                    <p>Entry</p>
                    <label>Entry Date:
                        <input
                            type='date'
                            placeholder='Enter'
                            max={new Date().toISOString().split("T")[0]}
                            value={log.entry_date}
                            onChange={e =>
                                setLog(prev => ({
                                    ...prev,
                                    entry_date: e.target.value
                                }))}
                        />
                    </label>
                    <DollarInput
                        placeholder='Stock Price'
                        value={log.entry_price}
                        onChange={e => setLog(prev => ({...prev, entry_price: e}))}
                    />
                    <DollarInput
                        placeholder='Premium'
                        value={log.entry_premium}
                        onChange={e => setLog(prev => ({...prev, entry_premium: e}))}
                    />
                </div>
                <div>
                    <p>Exit</p>
                    <label>Exit Date:
                        <input
                            type='date'
                            placeholder='Enter'
                            value={log.exit_date}
                            min={log.entry_date || ""}
                            max={new Date().toISOString().split("T")[0]}
                            onChange={e =>
                                setLog(prev => ({
                                    ...prev,
                                    exit_date: e.target.value
                                }))
                            }
                        />
                    </label>
                    <DollarInput
                        placeholder='Stock Price'
                        value={log.exit_price}
                        onChange={e =>
                            setLog(prev => ({...prev, exit_price: e}))}
                    />
                    <DollarInput
                        placeholder='Premium'
                        value={log.exit_premium}
                        onChange={e => setLog(prev => ({...prev, exit_premium: e}))}
                    />
                </div>
                <button type="submit">Save</button>
            </form>
        </>
    )
}