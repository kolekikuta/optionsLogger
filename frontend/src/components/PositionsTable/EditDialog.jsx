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
import { parseLocalDate, dateToYMD } from '@/components/CreateLog/CreateLog';

//EditDialog.whyDidYouRender = true

export default function EditDialog({ isOpen, onClose, onSave, entry, setEditEntry }) {

    if (!entry) return null;

    function handleSubmit(e) {
        e.preventDefault();
        onSave(entry);
        onClose();
    }

    return (
        <Dialog
          open={isOpen}
          onOpenChange={(open) => {
            if (!open) onClose();
          }}
        >

          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Edit Position Log</DialogTitle>
              <DialogDescription>
                Make changes to your position log here. Click save when you&apos;re
                done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid grid-col-2 gap-3">
                <div className="grid gap-3">
                  <Label htmlFor="ticker">Ticker</Label>
                  <Input id="ticker"
                    name="ticker"
                    value={entry.ticker ? entry.ticker : ""}
                    onChange={(e) => setEditEntry({ ...entry, ticker: e.target.value })}
                    />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="contract-type-select">Contract Type</Label>
                    <Select
                      value={entry.contract_type ? entry.contract_type : ""}
                      onValueChange={(value) => setEditEntry({ ...entry, contract_type: value })}
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
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-3">
                  <Label htmlFor="strike-1">Strike</Label>
                  <DollarInput
                    id="strike-1"
                    name="strike"
                    value={entry.strike}
                    onChange={(val) => {
                      setEditEntry({
                        ...entry,
                        strike: val
                      });
                    }} />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="quantity-1">Quantity</Label>
                  <Input
                    id="quantity-1"
                    name="quantity"
                    value={entry.quantity}
                    onChange={(e) => setEditEntry({ ...entry, quantity: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="expiration-date-1">Expiration Date</Label>
                <Calendar22
                  id="expiration-date-1"
                  value={entry.expiration_date ? parseLocalDate(entry.expiration_date) : null}
                  onChange={(d) =>
                    setEditEntry({
                      ...entry,
                      expiration_date: d ? dateToYMD(d) : null,
                    })
                  }
                />
              </div>
                <div className="grid grid-cols-2 gap-3">
                    <div className="grid gap-3">
                        <div className="grid gap-3">
                            <Label htmlFor="entry-date-1">Entry Date</Label>
                            <Calendar22
                              id="entry-date-1"
                              value={entry.entry_date ? parseLocalDate(entry.entry_date) : null}
                              onChange={(d) =>
                                setEditEntry({
                                  ...entry,
                                  entry_date: d ? dateToYMD(d) : null,
                                })
                              }
                            />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="entry-price-1">Entry Price</Label>
                            <DollarInput
                              id="entry-price-1"
                              value={entry.entry_price ? entry.entry_price : ""}
                              onChange={(val) => setEditEntry({ ...entry, entry_price: val })}
                            />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="entry-premium-1">Entry Premium</Label>
                            <DollarInput
                              id="entry-premium-1"
                              value={entry.entry_premium ? entry.entry_premium : ""}
                              onChange={(val) => setEditEntry({ ...entry, entry_premium: val })}
                            />
                        </div>
                    </div>
                    <div className="grid gap-3">
                        <div className="grid gap-3">
                            <Label htmlFor="exit-date-1">Exit Date</Label>
                            <Calendar22
                              id="exit-date-1"
                              value={entry.exit_date ? parseLocalDate(entry.exit_date) : null}
                              onChange={(d) =>
                                setEditEntry({
                                  ...entry,
                                  exit_date: d ? dateToYMD(d) : null,
                                })
                              }
                            />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="exit-price-1">Exit Price</Label>
                            <DollarInput
                              id="exit-price-1"
                              value={entry.exit_price ? entry.exit_price : ""}
                              onChange={(val) => setEditEntry({ ...entry, exit_price: val })}
                            />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="exit-premium-1">Exit Premium</Label>
                            <DollarInput
                              id="exit-premium-1"
                              value={entry.exit_premium ? entry.exit_premium : ""}
                              onChange={(val) => setEditEntry({ ...entry, exit_premium: val })}
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
    )
}