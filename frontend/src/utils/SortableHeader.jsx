import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";


export default function SortableHeader({ column, title }) {
  const sorted = column.getIsSorted();

  return (
    <div className="flex items-center gap-1">
        <Button
            variant="ghost"
            onClick={() => column.toggleSorting(sorted === "asc")}
            className="justify-start pl-2 pr-2"
        >
            {title}
        </Button>
        <div className="flex items-center justify-center">
            {sorted === "asc" && <ChevronUp className="h-4 w-4" />}
            {sorted === "desc" && <ChevronDown className="h-4 w-4" />}
        </div>
    </div>

  );
}