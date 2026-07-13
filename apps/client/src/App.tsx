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
import OrganizationDetailPage from './pages/OrganizationDetailPage.tsx';

function App() {

  return (
    
      <AuthProvider>
        <BrowserRouter>
          <div className="fixed inset-0 z-40 pointer-events-none border-[12px] border-white rounded-2xl"></div>
            <Navbar />
              <div className="rounded-2xl overflow-hidden">
                <main>
                  <Routes>
                    <Route path="/homepage" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/organizations" element={<OrganizationsPage />} />
                    <Route path="/events" element={<EventsPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/events/:id" element={<EventDetailPage />} />
                    <Route path="/organizations/:id" element={<OrganizationDetailPage />} />
                  </Routes>
                </main>
              </div>   
        </BrowserRouter>
      </AuthProvider>
  )
}

export default App
