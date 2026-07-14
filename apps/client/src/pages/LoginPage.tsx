import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../assets/logo.png';

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
                        navigate('/homepage') 
                    } else {
                        setError(data.message)
                    }  
                })
    }

    return (
        <div className='flex h-screen'>
            <div className='w-1/2 bg-orange-200' />
            <div className='w-1/2 flex items-center justify-center'>
                <div className='flex flex-col gap-4 w-[600px]'>
                   <div className='flex items-center gap-4 mb-8'>
                        <img src={logo} alt="VHUB" className='h-16 rotate-90 object-contain' />
                        <h1 className='text-5xl font-bold'>Login</h1>
                    </div>
                    <label>Email:</label>
                        <input
                            value = {email}
                            onChange = {(e) => setEmail(e.target.value)}
                            className='border border-gray-300 rounded-lg px-4 py-2 w-full'
                        />
                    <label>Password:</label>
                        <input
                            value = {password}
                            onChange = {(e) => setPassword(e.target.value)}
                            type='password'
                            className='border border-gray-300 rounded-lg px-4 py-2 w-full'
                        />
                    <div>
                        <Link to='/forgotpassword'>Forgot password?</Link>  
                    </div>      
                    {error && <p>{error}</p>}
                    <button onClick={handleSubmit} className='bg-orange-500 rounded-lg text-white px-6 py-2 w-full mt-2'> Log in </button>
                    <div className='flex items-center gap-4'>
                        <div className='flex-1 h-px bg-gray-300'></div>
                            <span className='text-gray-500 text-sm'>Or</span>
                        <div className='flex-1 h-px bg-gray-300'></div>
                    </div>
                    <button className='border border-gray-300 rounded-lg px-4 py-2 w-full'>Continue with Google</button>
                    <button className='border border-gray-300 rounded-lg px-4 py-2 w-full'>Continue with Apple</button>
                    <button className='border border-gray-300 rounded-lg px-4 py-2 w-full'>Continue with Facebook</button>
                    <div className='text-small flex items-center justify-center'>
                        <p>Don't have an account?</p>
                        <Link to='/register' className='font-bold px-2'>Register here!</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage