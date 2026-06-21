import { BrowserRouter, Routes, Route } from 'react-router-dom';

import EventsPage from './pages/EventsPage.tsx';
import LoginPage from './pages/LoginPage';

import './App.css';

function App() {

    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<EventsPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
    )
}

export default App
