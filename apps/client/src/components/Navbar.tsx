import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import name from '../assets/name.png';

function Navbar() {

    const { user, logout } = useAuth()

    return (
        <div className='border border-gray-200 bg-white text-black grid grid-cols-3 items-center px-10 py-4 rounded-b-2xl shadow-md mx-6 max-w-5xl mx-auto mt-4'>
            <div className='flex items-center gap-8'>
                <Link to="/homepage">Home</Link>
                <Link to="/events">Events</Link>
                <Link to="/organizations">Organizations</Link>
            </div>
            <div className='flex justify-center'>
                <img src={name} alt="VHUB name" className='h-8' />
            </div>
            <div className='flex items-center gap-4 justify-end'>
                {user ? <span>{user.name}</span> : <Link to="/login">Sign in</Link>}
                {user ? <button onClick={logout}>Log out</button> : <Link to="/register" className='bg-orange-500 text-white px-4 py-2 rounded-full'>Register</Link>}
            </div>
        </div>
    )
}

export default Navbar