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


export default function EditDialog({ isOpen, onClose, onSave }) {

    function handleSubmit(event) {
        event.preventDefault();
        onSave?.(form);
        onClose?.();
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
        <form onSubmit={handleSubmit}>
          <DialogContent className="sm:max-w-[425px]">
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
                  <Input id="ticker" name="ticker" />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="contract-type-select">Contract Type</Label>
                    <Select>
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
                  <Input id="strike-1" name="strike" />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="amount-1">Amount</Label>
                  <Input id="amount-1" name="strike" />
                </div>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="expiration-date-1">Expiration Date</Label>
                <Calendar22 id="expiration-date-1"/>
              </div>
                <div className="grid grid-cols-2 gap-3">
                    <div className="grid gap-3">
                        <div className="grid gap-3">
                            <Label htmlFor="entry-date-1">Entry Date</Label>
                            <Calendar22 id="entry-date-1"/>
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="entry-price-1">Entry Price</Label>
                            <DollarInput id="entry-price-1"/>
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="entry-premium-1">Entry Premium</Label>
                            <DollarInput id="entry-premium-1"/>
                        </div>
                    </div>
                    <div className="grid gap-3">
                        <div className="grid gap-3">
                            <Label htmlFor="exit-date-1">Exit Date</Label>
                            <Calendar22 id="exit-date-1"/>
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="exit-price-1">Exit Price</Label>
                            <DollarInput id="exit-price-1"/>
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="exit-premium-1">Exit Premium</Label>
                            <DollarInput id="exit-premium-1"/>
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
          </DialogContent>
        </form>
      </Dialog>
    )
}