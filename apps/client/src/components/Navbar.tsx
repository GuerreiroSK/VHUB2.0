import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {

    const { user, logout } = useAuth()

    return (
        <div>
            {user ? <span>Logged in as: {user.name}</span> : <Link to = "/login">Log in</Link>}
            {user ? <button onClick={logout}>Log out</button> : <Link to = "/register">Register</Link>}
            <Link to="/"> Home Page </Link>
            <Link to="/events"> Events </Link>
            <Link to="/organizations"> Organizations </Link>

        </div>    
    )
}

export default Navbar