import React from "react"
import { Link } from "react-router-dom"
import { Button } from '@/components/ui/button'

export default function LandingPage() {


    return(
        <>
            <h1>Landing Page</h1>
            <Link to="/sign-up">
                <Button>Sign Up</Button>
            </Link>
            <Link to="/login">
                <Button>Login</Button>
            </Link>

        </>
    )
}