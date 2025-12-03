import { useNavigate } from "react-router-dom"

export default function LandingPage({ toSignup, toLogin }) {


    return(
        <>
            <h1>Landing Page</h1>
            <button onClick={toSignup}>Sign Up</button>
            <button onClick={toLogin}>Login</button>
        </>
    )
}