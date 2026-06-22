import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function LoginPage() {

    const { login } = useAuth()

    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    function handleSubmit() {

            fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password})
            })
                .then(res => res.json().then(data => ({ ok: res.ok, data})))
                .then(({ok, data}) => {
                    if (ok) {
                       login(data)
                        navigate('/') 
                    } else {
                        setError(data.message)
                    }  
                })
    }

    return (
        <>
            <h1>Login Page</h1>

            <label>Email:</label>
            <input
                value = {email}
                onChange = {(e) => setEmail(e.target.value)}
            />

            <label>Password:</label>
            <input
                value = {password}
                onChange = {(e) => setPassword(e.target.value)}
                type='password'
            />
                {error && <p>{error}</p>}
            <button onClick={handleSubmit}> Log in </button>
        </>
    )
}

export default LoginPage