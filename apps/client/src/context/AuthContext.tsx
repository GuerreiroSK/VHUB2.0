import { createContext, useContext, useState } from 'react';

type User = {
    id: number
    name: string 
    email: string
    token: string
}

type AuthContextType = {
    user: User | null
    login: (user: User) => void
    logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {

    const [user, setUser] = useState<User | null>(null)

    function login(userData: User) {
        setUser(userData)
        localStorage.setItem('user', JSON.stringify(userData))
    }

    function logout() {
        setUser(null)
        localStorage.removeItem('user')
    }

    return (
        <AuthContext.Provider value = {{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {

    const context = useContext(AuthContext)

    if (!context) throw new Error('useAuth must be used inside AuthProvider')
        
    return context
}