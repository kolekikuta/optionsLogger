import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRef } from "react"
import { useSubmit } from "react-router-dom"
import { CircleUserRound } from "lucide-react"

export default function Header() {
    const submit = useSubmit()

    function handleLogout(e) {
        e?.preventDefault()
        submit(null, { method: 'post', action: '/logout' })
    }
    return (
        <header className="w-full px-4 py-2">
            <div className="mx-auto flex justify-end">
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <CircleUserRound size={30} className="cursor-pointer"/>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Profile</DropdownMenuItem>
                        <DropdownMenuItem onSelect={handleLogout} onClick={handleLogout} className="text-red-600">
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}