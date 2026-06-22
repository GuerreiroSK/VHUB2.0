import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.tsx';

import Navbar from './components/Navbar.tsx';
import EventsPage from './pages/EventsPage.tsx';
import LoginPage from './pages/LoginPage';

import './App.css';

function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
           <Routes>
            <Route path="/" element={<EventsPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
