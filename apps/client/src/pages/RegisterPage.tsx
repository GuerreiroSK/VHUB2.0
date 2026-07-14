import { useState } from 'react'
import { useNavigate, Link} from 'react-router-dom'
import logo from '../assets/logo.png';
function RegisterPage() {

    const navigate = useNavigate()

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [accountType, setAccountType] = useState('volunteer')

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
        <div className='flex h-screen'>
            <div className='w-1/2 flex items-center justify-center'>
                <div className='flex flex-col gap-4 w-[600px]'>
                    <div className='flex items-center gap-4 mb-8'>
                        <h1 className='text-5xl font-bold'>Create an account</h1>
                        <img src={logo} alt='VHUB' className='h-16 rotate-90 object-contain' />
                    </div>
                    <div className='flex gap-2'>
                        <button
                            onClick={() => setAccountType('volunteer')}
                            className={accountType === 'volunteer' ? 'flex-1 bg-orange-500 text-white rounded-lg py-2' : 'flex-1 bg-white border border-gray-300 rounded-lg py-2'}
                        >
                        Volunteer
                        </button>
                        <button
                            onClick={() => setAccountType('organization')}
                            className={accountType === 'organization' ? 'flex-1 bg-orange-500 text-white rounded-lg py-2' : 'flex-1 bg-white border border-gray-300 rounded-lg py-2'}
                        >
                        Organization
                        </button>
                    </div>
                    <label>Name:</label>
                        <input 
                            value = {name}
                            onChange = {(e) => setName(e.target.value)}
                            className='border border-gray-300 rounded-lg px-4 py-2 w-full'
                        />
                    <label>Email:</label>
                        <input 
                            value = {email}
                            onChange = {(e) => setEmail(e.target.value)}
                            className='border border-gray-300 rounded-lg px-4 py-2 w-full'
                        />
                    <label>Password:</label>
                        <input
                            type='password' 
                            value = {password}
                            onChange = {(e) => setPassword(e.target.value)}
                            className='border border-gray-300 rounded-lg px-4 py-2 w-full'
                        />
                    <label>Confirm Password:</label>
                        <input
                            type='password' 
                            value = {confirmPassword}
                            onChange = {(e) => setConfirmPassword(e.target.value)}
                            className='border border-gray-300 rounded-lg px-4 py-2 w-full'
                        />
                    <div className='flex items-center gap-2'>
                        <input type='checkbox' id='policy' />
                        <label htmlFor='policy'>I agree to the <Link to='/policy' className='text-orange-500'>Terms and Privacy Policy</Link></label>
                    </div>    
                    {error && <p>{error}</p>}
                    <button onClick={handleSubmit} className='bg-orange-500 rounded-lg text-white px-6 py-2 w-full mt-2'> Register </button>
                    <div className='text-small flex items-center justify-center'>
                        <p>Already have an account?</p>
                        <Link to='/login' className='font-bold px-2'>Login here!</Link>
                    </div>
                </div>
            </div>
            <div className='w-1/2 bg-orange-200' />
        </div>
    )
}

export default RegisterPage