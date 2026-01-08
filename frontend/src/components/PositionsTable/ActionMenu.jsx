import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuGroup, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ActionMenu({ entry, onEdit, onDelete, onMove }) {
    function handleEdit() {
        window.requestAnimationFrame(() => onEdit(entry));
    }

    function handleDelete() {
        window.requestAnimationFrame(() => onDelete(entry.id));
    }

    function handleMove() {
      window.requestAnimationFrame(() => onMove(entry));
    }

    return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleEdit}>
              Edit
            </DropdownMenuItem>

            <DropdownMenuItem onClick={handleDelete} className="text-red-600">
              Delete
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={handleMove}>
                Move
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
    )
}