"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function Calendar22({ label, value, onChange, minDate, maxDate }) {
  const [open, setOpen] = React.useState(false)

  const displayDate = value  instanceof Date && !isNaN(value)
    ? value.toLocaleDateString()
    : "Select date"
  return (
    <div className="flex flex-col gap-3">
        {label && (
            <Label htmlFor="date" className="px-1">
                {label}
            </Label>
        )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="w-48 justify-between font-normal"
          >
            {displayDate}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            captionLayout="dropdown"
            onSelect={d => {
              onChange(d)
              setOpen(false)
            }}
            fromDate={minDate}
            toDate={maxDate}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
