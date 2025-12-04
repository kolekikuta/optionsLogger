import { useState } from 'react';
import axios from 'axios';
import DollarInput from '../../utils/DollarInput';
import CreatableSelect from "react-select/creatable";
import './CreateLog.css'
import { Calendar22 } from '../ui/datepicker';
import { Input } from  '../ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel
} from "@/components/ui/select"



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

    const [alertMessage, setAlertMessage] = useState("");
    const [alertOpen, setAlertOpen] = useState(false);

    const [tickerInput, setTickerInput] = useState("");

    const tickers = ["AAPL", "MSFT", "GOOGL", "TSLA", "SPY", "QQQ", "AMZN"].map(t => ({
        label: t,
        value: t
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
            setAlertMessage(`Please complete the following fields: ${missing.join(", ")}`);
            setAlertOpen(true);
            return;
        }

        // if any of exit date is filled, make sure the rest is filled
        const anyExit = log.exit_date || log.exit_price || log.exit_premium;
        const allExit = log.exit_date && log.exit_price && log.exit_premium;
        if (anyExit && !allExit) {
            setAlertMessage("Please complete all of the exit fields");
            setAlertOpen(true);
            return;
        }

        //check that ticker exists
        const isValid = await validateTicker(log.ticker);
        if(!isValid) {
            setAlertMessage(`Ticker "${log.ticker}" does not exist or yfinance cannot pull data for it.`);
            setAlertOpen(true);
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

    function dateToYMD(date) {
        const y = date.getFullYear()
        const m = String(date.getMonth() + 1).padStart(2, "0")
        const d = String(date.getDate()).padStart(2, "0")
        return `${y}-${m}-${d}`
    }

    function parseLocalDate(ymd) {
        if (!ymd) return null;
        const [y, m, d] = ymd.split("-");
        return new Date(Number(y), Number(m) - 1, Number(d));
    }

    return (
        <>
            <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Missing fields</AlertDialogTitle>
                        <AlertDialogDescription>{alertMessage}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction>OK</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <form onSubmit={handleSave}>
                <div className="ticker-type-container">
                    <Input
                        type="text"
                        placeholder="Ticker Symbol"
                        value={log.ticker || ""}
                        onChange={(e) =>
                            setLog(prev => ({
                                ...prev,
                                ticker: e.target.value.toUpperCase()
                            }))}
                    />
                    <Select
                        value={log.contract_type || undefined}
                        onValueChange={(value) =>
                            setLog(prev => ({
                                ...prev,
                                contract_type: value
                            }))}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Contract Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                            <SelectItem value="call">Call</SelectItem>
                            <SelectItem value="put">Put</SelectItem>
                            <SelectItem value="shares">Shares</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                {log.contract_type !== "shares" && (
                    <div>
                        <DollarInput
                            value={log.strike}
                            onChange={(e) => setLog(prev => ({...prev, strike: e}))}
                            placeholder='Strike'
                        />
                        <Input
                            type="number"
                            placeholder="Number of contracts"
                            step="1"
                            min="1"
                            value={log.amount}
                            onChange={(e) =>
                                setLog(prev => ({
                                    ...prev,
                                    amount: e.target.value
                                }))}
                        />
                        <Calendar22
                            label="Expiration Date"
                            value={log.expiration_date ? parseLocalDate(log.expiration_date) : null}
                            onChange={(d) =>
                                setLog(prev => ({
                                    ...prev,
                                    expiration_date: d ? dateToYMD(d) : null
                                }))
                            }
                            minDate={log.entry_date ? parseLocalDate(log.entry_date) : null}
                        />
                    </div>
                )}
                <div className="two-columns">
                    <div className="entry-exit-container">
                        <h3>Entry</h3>
                        <Calendar22
                            label="Entry Date"
                            value={log.entry_date ? parseLocalDate(log.entry_date) : null}
                            onChange={(d) =>
                                setLog(prev => ({
                                    ...prev,
                                    entry_date: d ? dateToYMD(d) : null
                                }))
                            }
                        />
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
                    <div className="entry-exit-container">
                        <h3>Exit</h3>
                        <Calendar22
                            label="Exit Date"
                            value={log.exit_date ? parseLocalDate(log.exit_date) : null}
                            onChange={(d) =>
                                setLog(prev => ({
                                    ...prev,
                                    exit_date: d ? dateToYMD(d) : null
                                }))
                            }
                        />
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
                </div>
                <Button type="submit">Save</Button>
            </form>
        </>
    )
}