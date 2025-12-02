import { useState } from 'react';
import axios from 'axios';
import DollarInput from '../utils/DollarInput';

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
        strike: null
    });

    async function handleSave() {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;

        const requiredFields = [
            "ticker",
            "entry_date",
            "entry_price",
            "entry_premium",
            "expiration_date",
            "strike"
        ]

        const missing = requiredFields.filter(field => !log[field]);

        if(missing.length > 0){
            alert(`Please complete the following fields: ${missing.join(", ")}`);
            return;
        }
        //check that ticker exists

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
            strike: null
        });
    }
    return (
        <>
            <input
                type='text'
                placeholder='Ticker'
                value={log.ticker}
                onChange={e =>
                    setLog(prev => ({
                        ...prev,
                        ticker: e.target.value
                    }))
                }
            />
            <DollarInput
                value={log.strike}
                onChange={(e) => setLog(prev => ({...prev, strike: e}))}
                placeholder='Strike'
            />
            <div>
                <p>Entry</p>
                <label>Entry Date:


                    <input
                        type='date'
                        placeholder='Enter'
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
                <label>
                    Expiration Date:
                    <input
                        type='date'
                        placeholder='Expiration'
                        value={log.entry_premium}
                        onChange={e =>
                            setLog(prev => ({
                                ...prev,
                                expiration_date: e.target.value
                            }))
                        }
                    />
                </label>

            </div>
            <div>
                <p>Exit</p>
                <label>Exit Date:


                    <input
                        type='date'
                        placeholder='Enter'
                        value={log.exit_date}
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
            <button
                onClick={handleSave}
            >Save</button>


        </>
    )
}