import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
function RegisterPage() {

    const navigate = useNavigate()

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const [error, setError] = useState('')

    function handleSubmit() {

        if (password !== confirmPassword) {

            return setError('Passwords do not match');
        }

        fetch('http://localhost:3000/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({name, email, password})
        })
            .then(res => res.json().then(data => ({ ok: res.ok, data})))
            .then(({ok, data}) => {
                if(ok) {
                    navigate('/')
                } else {
                    setError(data.message)
                }
            })
    }

    return (
        <>
            <h1> Register Page</h1>
            <label>Name:</label>
            <input 
                value = {name}
                onChange = {(e) => setName(e.target.value)}
            />
            <label>Email:</label>
            <input 
                value = {email}
                onChange = {(e) => setEmail(e.target.value)}
            />
            <label>Password:</label>
            <input
                type='password' 
                value = {password}
                onChange = {(e) => setPassword(e.target.value)}
            />
            <label>Confirm Password:</label>
            <input
                type='password' 
                value = {confirmPassword}
                onChange = {(e) => setConfirmPassword(e.target.value)}
            />
            {error && <p>{error}</p>}
            <button onClick={handleSubmit}> Register </button>
        </>
    )
}

export default RegisterPage