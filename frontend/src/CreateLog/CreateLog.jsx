import { useState } from 'react';
import DollarInput from '../utils/DollarInput';

export default function CreateLog() {

    const [log, setLog] = useState({
        ticker: null,
        strike: null,
        entry_date: null,
        entry_price: null,
        entry_premium: null,
        exit_date: null,
        exit_price: null,
        exit_premium: null
    });

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
            <input
                type='number'
                placeholder='Strike'
                min='0'
                value={log.strike}
                onChange={e =>
                    setLog(prev => ({
                        ...prev,
                        strike: e.target.value
                    }))
                }
            />
            <div>
                <p>Entry</p>
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
                <input
                    type='number'
                    placeholder='Stock Price'
                    min='0'
                    value={log.entry_price}
                    onChange={e =>
                        setLog(prev => ({
                            ...prev,
                            entry_price: e.target.value
                        }))
                    }
                />
                <input
                    type='number'
                    placeholder='Premium'
                    min='0'
                    value={log.entry_premium}
                    onChange={e =>
                        setLog(prev => ({
                            ...prev,
                            entry_premium: e.target.value
                        }))
                    }
                />
            </div>
            <div>
                <p>Exit</p>
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
                <input
                    type='number'
                    placeholder='Stock Price'
                    min='0'
                    step="0.01"
                    value={log.exit_price}
                    onChange={e =>
                        setLog(prev => ({
                            ...prev,
                            exit_price: e.target.value
                        }))
                    }
                />
                <input
                    type='number'
                    placeholder='Premium'
                    min='0'
                    value={log.exit_premium}
                    onChange={e =>
                        setLog(prev => ({
                            ...prev,
                            exit_premium: e.target.value
                        }))
                    }
                />
            </div>



        </>
    )
}