import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import name from '../assets/name.png';

function Navbar() {

    const { user, logout } = useAuth()

    return (
        <div className='fixed top-0 left-0 right-0 z-[60]'>
            <div className='relative bg-white text-black grid grid-cols-3 items-center px-10 py-4 rounded-b-2xl max-w-5xl mx-auto'>
                <div className='flex items-center gap-8'>
                    <Link to="/homepage">Home</Link>
                    <Link to="/events">Events</Link>
                    <Link to="/organizations">Organizations</Link>
                </div>
                <div className='flex justify-center'>
                    <img src={name} alt="VHUB name" className='h-8' />
                </div>
                <div className='flex items-center gap-8 justify-end'>
                    {user ? <span>{user.name}</span> : <Link to="/login">Sign in</Link>}
                    {user ? <button onClick={logout}>Log out</button> : <Link to="/register" className='bg-orange-500 text-white px-4 py-2 rounded-full'>Register</Link>}
                </div>
                <svg className='absolute bottom-7 -left-5 w-6 h-6' viewBox="0 0 16 16">
                    <path d="M0 0 C0 0 16 0 16 16 L16 0 Z" fill="white"/>
                </svg>
                <svg className='absolute bottom-7 -right-5 w-6 h-6' viewBox="0 0 16 16">
                    <path d="M16 0 C16 0 0 0 0 16 L0 0 Z" fill="white"/>
                </svg>
            </div>
        </div>
    )
}

export default Navbar