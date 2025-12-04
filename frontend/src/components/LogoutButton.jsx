import { Form } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function LogoutButton() {
    return (
        <Form method="post" action="/logout">
            <Button type="submit" variant="outline">
                Logout
            </Button>
        </Form>
    )
}