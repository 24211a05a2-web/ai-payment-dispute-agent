import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import DisputeFormPage from './pages/DisputeFormPage';
import TrackDisputePage from './pages/TrackDisputePage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import DisputeDetailPage from './pages/DisputeDetailPage';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dispute" element={<DisputeFormPage />} />
            <Route path="/track" element={<TrackDisputePage />} />
            <Route path="/dashboard" element={<AdminDashboardPage />} />
            <Route path="/dispute-details/:ticketId" element={<DisputeDetailPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
