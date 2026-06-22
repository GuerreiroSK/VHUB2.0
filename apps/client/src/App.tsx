import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.tsx';

import Navbar from './components/Navbar.tsx';
import EventsPage from './pages/EventsPage.tsx';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage.tsx';

import './App.css';


function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
           <Routes>
            <Route path="/events" element={<EventsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
