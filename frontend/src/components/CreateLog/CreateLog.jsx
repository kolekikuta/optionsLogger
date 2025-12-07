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
import { createClient } from '@/lib/client'



export default function CreateLog() {

    const [log, setLog] = useState({
        ticker: "",
        contract_type: "",
        strike: null,
        quantity: null,
        expiration_date: null,
        entry_date: null,
        entry_price: null,
        entry_premium: null,
        exit_date: null,
        exit_price: null,
        exit_premium: null
    });

    const [alertMessage, setAlertMessage] = useState("");
    const [alertTitle, setAlertTitle] = useState("");
    const [alertOpen, setAlertOpen] = useState(false);

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
                "quantity"
            ];
        }

        const missing = requiredFields.filter(field => !log[field]);

        // check all required fields are complete
        if(missing.length > 0){
            setAlertTitle("Missing Fields");
            setAlertMessage(`Please complete the following fields: ${missing.join(", ")}`);
            setAlertOpen(true);
            return;
        }

        // check all or none of exit fields are complete
        const anyExit = log.exit_date || log.exit_price || log.exit_premium;
        const allExit = log.exit_date && log.exit_price && log.exit_premium;
        if (anyExit && !allExit) {
            setAlertTitle("Missing Fields");
            setAlertMessage("Please complete all of the exit fields");
            setAlertOpen(true);
            return;
        }

        // check that ticker exists
        const isValid = await validateTicker(log.ticker);
        if(!isValid) {
            setAlertTitle("Ticker Symbol Error")
            setAlertMessage(`Ticker "${log.ticker}" does not exist or yfinance cannot pull data for it.`);
            setAlertOpen(true);
            return;
        }

        const supabase = createClient();
        const {
            data: { session }
        } = await supabase.auth.getSession();
        if (!session) {
            setAlertTitle("Error")
            setAlertMessage("You must be logged in.");
            setAlertOpen(true);
            return;
        }

        await axios.post(`${backendUrl}/api/positions/create`,
            log,
            {
                headers: {
                    Authorization: `Bearer ${session.access_token}`
                }
            }
        );
        setLog({
            ticker: "",
            contract_type: "",
            strike: null,
            quantity: null,
            expiration_date: null,
            entry_date: null,
            entry_price: null,
            entry_premium: null,
            exit_date: null,
            exit_price: null,
            exit_premium: null,
        });
        setAlertTitle("Success!")
        setAlertMessage("Postion saved");
        setAlertOpen(true);
    }

    async function validateTicker(ticker) {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        try {
            const res = await axios.get(`${backendUrl}/api/validate_ticker`, {
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

    function getExitDisabledRange() {
        const entry = log.entry_date ? parseLocalDate(log.entry_date) : null;
        const expiration = log.expiration_date ? parseLocalDate(log.expiration_date) : null;

        if (entry && expiration) {
            return {
                before: entry,
                after: expiration
            };
        }

        if (entry) {
            return {
                before: entry
            };
        }

        return null;
    }

    return (
        <>
            <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{alertTitle}</AlertDialogTitle>
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
                        value={log.ticker}
                        onChange={(e) =>
                            setLog(prev => ({
                                ...prev,
                                ticker: e.target.value.toUpperCase()
                            }))}
                    />
                    <Select
                        value={log.contract_type}
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
                            value={log.quantity || ""}
                            onChange={(e) =>
                                setLog(prev => ({
                                    ...prev,
                                    quantity: e.target.value
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
                            disabled={log.entry_date ? { before : parseLocalDate(log.entry_date)} : null}
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
                            disabled={log.expiration_date ? { after : parseLocalDate(log.expiration_date) } : null}
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
                            disabled={getExitDisabledRange()}
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