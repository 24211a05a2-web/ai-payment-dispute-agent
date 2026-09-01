import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="space-y-24 py-8">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 px-4 lg:px-8 text-center max-w-5xl mx-auto">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none"></div>
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none"></div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Intelligent Automated Dispute Audit Engine
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight mb-6">
          Resolve Payment Issues <br />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
            Faster with AI Agent
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
          An AI-powered payment dispute resolution assistant that analyzes transactions, verifies policies, and recommends the right resolution.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/dispute"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold text-base shadow-lg shadow-emerald-500/25 hover:opacity-95 transition-all transform hover:-translate-y-0.5"
          >
            Submit a Dispute
          </Link>
          <Link
            to="/track"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-200 font-semibold text-base hover:bg-slate-800 hover:text-white transition-all"
          >
            Track Existing Dispute
          </Link>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Engineered for Instant Audit & Trust</h2>
          <p className="text-slate-400 text-sm">Combining LLM intelligence with bank database verification and policy RAG retrieval.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="glass-card p-6 rounded-2xl border border-slate-800 hover:border-emerald-500/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
              🤖
            </div>
            <h3 className="text-lg font-bold text-white mb-2">AI-Powered Analysis</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              LLMs parse natural language complaints to extract intent, category, and dispute entities automatically.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-800 hover:border-indigo-500/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
              🔍
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Transaction Verification</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Cross-references customer ID, payment gateway settlement logs, and order fulfillment states in real-time.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-800 hover:border-teal-500/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
              📚
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Policy-Based RAG</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Vector store retrieves relevant terms, refund policies, and SLA clauses to justify decision recommendations.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-800 hover:border-purple-500/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
              ⚡
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Faster Resolution</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Automates straightforward refund approvals in under 5 seconds, while escalating complex fraud claims.
            </p>
          </div>

        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="glass-card p-8 lg:p-12 rounded-3xl border border-slate-800 relative overflow-hidden">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">How DisputeAI Works</h2>
            <p className="text-slate-400 text-sm">A 4-step autonomous pipeline designed for speed and transparency.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            
            <div className="flex flex-col items-center text-center p-4 bg-slate-900/60 rounded-2xl border border-slate-800">
              <span className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-sm flex items-center justify-center mb-3">1</span>
              <h4 className="text-sm font-semibold text-white mb-1">Complaint</h4>
              <p className="text-xs text-slate-400">Customer submits transaction details & description</p>
            </div>

            <div className="flex flex-col items-center text-center p-4 bg-slate-900/60 rounded-2xl border border-slate-800">
              <span className="w-8 h-8 rounded-full bg-teal-500/20 text-teal-400 font-bold text-sm flex items-center justify-center mb-3">2</span>
              <h4 className="text-sm font-semibold text-white mb-1">Txn Verification</h4>
              <p className="text-xs text-slate-400">Database queries gateway logs & order status</p>
            </div>

            <div className="flex flex-col items-center text-center p-4 bg-slate-900/60 rounded-2xl border border-slate-800">
              <span className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 font-bold text-sm flex items-center justify-center mb-3">3</span>
              <h4 className="text-sm font-semibold text-white mb-1">Policy Analysis</h4>
              <p className="text-xs text-slate-400">RAG extracts exact refund clauses & guidelines</p>
            </div>

            <div className="flex flex-col items-center text-center p-4 bg-slate-900/60 rounded-2xl border border-slate-800">
              <span className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 font-bold text-sm flex items-center justify-center mb-3">4</span>
              <h4 className="text-sm font-semibold text-white mb-1">Resolution</h4>
              <p className="text-xs text-slate-400">Issues automated refund or escalates ticket</p>
            </div>

          </div>
        </div>
      </section>

      {/* Live Demonstration Example Section */}
      <section className="max-w-4xl mx-auto px-4 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Live AI Analysis Example</h2>
          <p className="text-slate-400 text-xs">Preview how the AI processes real customer scenarios.</p>
        </div>

        <div className="glass-card p-6 lg:p-8 rounded-2xl border border-slate-800 shadow-2xl">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800 text-xs">
            <span className="text-slate-400 font-medium">Sample Complaint Input</span>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">Demo Scenario 1</span>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl text-slate-200 text-sm font-mono mb-6 border border-slate-800">
            "My money was deducted but my order failed."
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">AI Audit Check</span>
              <div className="text-xs space-y-1 text-slate-300">
                <p>• Payment Gateway: <span className="text-emerald-400 font-semibold">SUCCESS (₹500)</span></p>
                <p>• Merchant Order: <span className="text-rose-400 font-semibold">FAILED</span></p>
                <p>• Confidence: <span className="text-emerald-400 font-bold">94%</span></p>
              </div>
            </div>

            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider">Policy & Action</span>
              <div className="text-xs space-y-1 text-slate-300">
                <p>• Refund Policy: <span className="text-slate-200 font-medium">Section 1 Order Failure Eligible</span></p>
                <p>• Resolution: <span className="text-emerald-400 font-bold">Refund Initiated</span></p>
                <p>• Generated Ticket: <span className="text-indigo-300 font-mono font-semibold">DSP-10025</span></p>
              </div>
            </div>

          </div>

          <div className="mt-6 text-center">
            <Link
              to="/dispute"
              className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <span>Try filing a live complaint now</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
