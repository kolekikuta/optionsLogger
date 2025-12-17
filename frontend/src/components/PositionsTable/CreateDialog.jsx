import { useState } from 'react'
import { Calendar22 } from '@/components/ui/datepicker'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import DollarInput from '@/utils/DollarInput'
import { parseLocalDate } from '@/utils/parseLocalDate'
import { dateToYMD } from '@/utils/dateToYMD'
import { Plus } from "lucide-react"
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
import axios from 'axios'
import { createClient } from '@/lib/client'
import { getEntryDisabledRange, getExitDisabledRange } from '@/utils/datepicker'


//EditDialog.whyDidYouRender = true

export default function CreateDialog({ refreshKey, setRefreshKey }) {

    const [log, setLog] = useState({
        ticker: undefined,
        contract_type: undefined,
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
    const [open, setOpen] = useState(false);


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
        const result = await validateTicker(log.ticker);
        if (!result.ok) {
            if (result.reason === "network") {
                setAlertTitle("Connection Error");
                setAlertMessage(
                "Cannot reach the server. Please check your connection or try again later."
                );
            } else {
                setAlertTitle("Server Error");
                setAlertMessage("The server responded with an error.");
            }

        setAlertOpen(true);
        return;
        }

            if (!result.valid) {
                setAlertTitle("Ticker Symbol Error");
                setAlertMessage(
                    `Ticker "${log.ticker}" does not exist or data cannot be retrieved.`
                );
            setAlertOpen(true);
            return;
            }

        const supabase = createClient();
        const {
            data: { session }
        } = await supabase.auth.getSession();
        if (!session) {
            setAlertTitle("Error");
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
            ticker: undefined,
            contract_type: undefined,
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
        setRefreshKey(prev => prev + 1);
        setOpen(false);
        setAlertTitle("Success!")
        setAlertMessage("Postion saved");
        setAlertOpen(true);
    }

    async function validateTicker(ticker) {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        try {
            const res = await axios.get(`${backendUrl}/api/validate_ticker`, {
                params: { symbol: ticker },
                timeout: 5000,
            });

            return {
                ok: true,
                valid: res.data.valid,
            };
        } catch (err) {
            if (!err.response) {
                return {
                    ok: false,
                    reason: "network",
                };
            }

            console.error("Ticker validation failed:", err);
            return {
                ok: false,
                reason: "backend",
                status: err.response.status,
            };
        }
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
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button
                        variant="ghost"
                        className="text-white"
                    >
                        <Plus />
                    </Button>

                </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSave}>
                <DialogHeader>
                <DialogTitle>Create Position Log</DialogTitle>
                <DialogDescription>
                    Create a new position log here. Click save when you&apos;re
                    done.
                </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                <div className="grid grid-col-2 gap-3">
                    <div className="grid gap-3">
                    <Label htmlFor="ticker">Ticker</Label>
                    <Input id="ticker"
                        type="text"
                        name="ticker"
                        placeholder="Ticker Symbol"
                        value={log.ticker}
                        onChange={(e) => setLog({ ...log, ticker: e.target.value.toUpperCase() })}
                        />
                    </div>
                    <div className="grid gap-3">
                    <Label htmlFor="contract-type-select">Contract Type</Label>
                        <Select
                        value={log.contract_type}
                        onValueChange={(value) => setLog({ ...log, contract_type: value })}
                        >

                            <SelectTrigger className="w-[180px]" id="contract-type-select">
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
                </div>
                {log.contract_type != "shares" && (
                    <div className="grid grid-cols-2 gap-3">
                        <div className="grid gap-3">
                        <Label htmlFor="strike-1">Strike</Label>
                        <DollarInput
                            id="strike-1"
                            name="strike"
                            value={log.strike}
                            onChange={(val) => {
                            setLog(prev => ({
                                ...prev,
                                strike: val
                            }));
                            }} />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="expiration-date-1">Expiration Date</Label>
                            <Calendar22
                            id="expiration-date-1"
                            value={log.expiration_date ? parseLocalDate(log.expiration_date) : null}
                            onChange={(d) =>
                                setLog(prev => ({
                                ...prev,
                                expiration_date: d ? dateToYMD(d) : null,
                                }))
                            }
                            disabled={log.entry_date ? { before : parseLocalDate(log.entry_date)} : null}
                            />
                        </div>
                    </div>
                )}
                <div className="grid gap-3">
                    <Label htmlFor="quantity-1">Quantity</Label>
                    <Input
                        id="quantity-1"
                        type="number"
                        name="quantity"
                        step="1"
                        min="1"
                        value={log.quantity || ""}
                        onChange={(e) => setLog(prev => ({ ...prev, quantity: e.target.value }))}
                    />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="grid gap-3">
                            <div className="grid gap-3">
                                <Label htmlFor="entry-date-1">Entry Date</Label>
                                <Calendar22
                                id="entry-date-1"
                                value={log.entry_date ? parseLocalDate(log.entry_date) : null}
                                onChange={(d) =>
                                    setLog(prev => ({
                                    ...prev,
                                    entry_date: d ? dateToYMD(d) : null,
                                    }))
                                }
                                disabled={getEntryDisabledRange(log.entry_date, log.expiration_date)}
                                />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="entry-price-1">Entry Price</Label>
                                <DollarInput
                                id="entry-price-1"
                                placeholder="Entry Stock Price"
                                value={log.entry_price}
                                onChange={val => setLog(prev => ({ ...prev, entry_price: val }))}
                                />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="entry-premium-1">Entry Premium</Label>
                                <DollarInput
                                id="entry-premium-1"
                                placeholder="Entry Premium"
                                value={log.entry_premium}
                                onChange={val => setLog(prev => ({ ...prev, entry_premium: val }))}
                                />
                            </div>
                        </div>
                        <div className="grid gap-3">
                            <div className="grid gap-3">
                                <Label htmlFor="exit-date-1">Exit Date</Label>
                                <Calendar22
                                id="exit-date-1"
                                value={log.exit_date ? parseLocalDate(log.exit_date) : null}
                                onChange={(d) =>
                                    setLog(prev => ({
                                    ...prev,
                                    exit_date: d ? dateToYMD(d) : null,
                                    }))
                                }
                                disabled={getExitDisabledRange(log.expiration_date)}
                                />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="exit-price-1">Exit Price</Label>
                                <DollarInput
                                id="exit-price-1"
                                placeholder="Exit Stock Price"
                                value={log.exit_price}
                                onChange={val => setLog(prev => ({ ...log, exit_price: val }))}
                                />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="exit-premium-1">Exit Premium</Label>
                                <DollarInput
                                id="exit-premium-1"
                                value={log.exit_premium}
                                placeholder="Exit Premium"
                                onChange={val => setLog(prev => ({ ...prev, exit_premium: val }))}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Save changes</Button>
                </DialogFooter>
                </form>
            </DialogContent>

        </Dialog>
    </>
    )
}