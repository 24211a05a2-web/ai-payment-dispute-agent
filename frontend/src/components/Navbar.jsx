import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path 
      ? 'text-emerald-400 bg-slate-800/80 font-semibold shadow-sm' 
      : 'text-slate-300 hover:text-white hover:bg-slate-800/40';
  };

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
              Dispute<span className="text-emerald-400">AI</span>
              <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Agent</span>
            </span>
            <span className="text-[11px] text-slate-400 font-medium">Smart Payment Resolution</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-1.5 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800/60">
          <Link to="/" className={`px-4 py-2 rounded-xl text-sm transition-all ${isActive('/')}`}>
            Home
          </Link>
          <Link to="/dispute" className={`px-4 py-2 rounded-xl text-sm transition-all ${isActive('/dispute')}`}>
            Submit Dispute
          </Link>
          <Link to="/track" className={`px-4 py-2 rounded-xl text-sm transition-all ${isActive('/track')}`}>
            Track Dispute
          </Link>
          <Link to="/dashboard" className={`px-4 py-2 rounded-xl text-sm transition-all ${isActive('/dashboard')}`}>
            Dashboard
          </Link>
        </div>

        {/* CTA Button */}
        <div className="flex items-center space-x-3">
          <Link 
            to="/dispute"
            className="relative group overflow-hidden rounded-xl p-[1px] font-semibold text-sm focus:outline-none"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 rounded-xl group-hover:opacity-90 transition-opacity"></span>
            <span className="relative block px-4 py-2 rounded-[11px] bg-slate-950 text-white font-medium group-hover:bg-opacity-0 transition-all flex items-center gap-2">
              <span>Resolve a Payment Issue</span>
              <svg className="w-4 h-4 text-emerald-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          </Link>
        </div>

      </div>
    </nav>
  );
}
