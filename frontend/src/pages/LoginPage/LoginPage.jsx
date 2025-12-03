
export default function LoginPage({ toSignup }) {
    return (
        <>
            <h1>Login</h1>
            <button onClick={toSignup}>Sign Up</button>
        </>
    )
}