import { Form } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

export function LogoutButton() {
    return (
        <Form method="post" action="/logout">
            <Button type="submit" variant="ghost" className="w-full flex justify-start font-normal text-red-600 hover:bg-red-600/10">
                <LogOut size={16} />
                Logout
            </Button>
        </Form>
    )
}