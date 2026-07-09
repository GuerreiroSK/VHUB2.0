import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.tsx';

import Navbar from './components/Navbar.tsx';
import EventsPage from './pages/EventsPage.tsx';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage.tsx';
import OrganizationsPage from './pages/OrganizationsPage.tsx';
import HomePage from './pages/HomePage.tsx';
import EventDetailPage from './pages/EventDetailPage.tsx';

import './App.css';

function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
           <Routes>
            <Route path="/homepage" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/organizations" element={<OrganizationsPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/events/:id" element={<EventDetailPage />} />
          </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
