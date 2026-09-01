import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 text-slate-400 py-12 px-4 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-bold">
              D
            </div>
            <span className="text-lg font-bold text-white tracking-tight">DisputeAI</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            AI-powered payment dispute resolution agent built for high-accuracy transaction auditing, policy verification, and automated refund eligibility analysis.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">Product Pages</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/" className="hover:text-emerald-400 transition-colors">Home Landing</Link></li>
            <li><Link to="/dispute" className="hover:text-emerald-400 transition-colors">Submit Dispute</Link></li>
            <li><Link to="/track" className="hover:text-emerald-400 transition-colors">Track Ticket Status</Link></li>
            <li><Link to="/dashboard" className="hover:text-emerald-400 transition-colors">Admin Dashboard</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">AI & Stack Architecture</h4>
          <ul className="space-y-2 text-xs">
            <li className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> FastAPI Backend & SQLAlchemy</li>
            <li className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span> RAG ChromaDB & Policy Knowledge Store</li>
            <li className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span> Gemini LLM Classifier & Decision Engine</li>
            <li className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span> React.js & Vite Frontend</li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">Project Information</h4>
          <p className="text-xs text-slate-400 leading-relaxed mb-3">
            College Internship Project Prototype — Simulates payment gateway verification and policy check logic safely with preloaded database records.
          </p>
          <div className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-medium">
            ● Backend Status: Connected
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto border-t border-slate-800/60 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400">
        <p>© 2026 DisputeAI Agent System. All rights reserved.</p>
        <p className="mt-2 md:mt-0">College Internship Final Demonstration</p>
      </div>
    </footer>
  );
}
