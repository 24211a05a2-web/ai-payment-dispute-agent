import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import ConfidenceBadge from '../components/ConfidenceBadge';

export default function TrackDisputePage() {
  const [searchParams] = useSearchParams();
  const initialTicket = searchParams.get('ticket') || 'DSP-10001';

  const [ticketIdInput, setTicketIdInput] = useState(initialTicket);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ticketData, setTicketData] = useState(null);

  const fetchTicketDetails = async (idToSearch) => {
    if (!idToSearch.trim()) return;
    setError(null);
    setLoading(true);

    try {
      const data = await api.getTicket(idToSearch.trim());
      setTicketData(data);
    } catch (err) {
      setError(err.message || `Ticket '${idToSearch}' not found.`);
      setTicketData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialTicket) {
      fetchTicketDetails(initialTicket);
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchTicketDetails(ticketIdInput);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Track Dispute Ticket</h1>
        <p className="text-sm text-slate-400">
          Enter your unique Ticket ID below to track real-time resolution progress and AI audit decisions.
        </p>
      </div>

      {/* Ticket Lookup Form */}
      <form onSubmit={handleSearch} className="glass-card p-4 sm:p-6 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={ticketIdInput}
            onChange={(e) => setTicketIdInput(e.target.value)}
            placeholder="Enter Ticket ID (e.g. DSP-10001)"
            className="flex-1 px-4 py-3 rounded-xl glass-input text-sm text-white placeholder-slate-500 font-mono tracking-wider"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-sm hover:opacity-95 transition-all flex items-center justify-center gap-2"
          >
            {loading ? 'Searching...' : 'Track Ticket'}
          </button>
        </div>

        {/* Quick Demo Tickets */}
        <div className="flex items-center gap-2 text-xs text-slate-400 flex-wrap pt-2 border-t border-slate-800/80">
          <span className="font-semibold text-slate-300">Quick Test Tickets:</span>
          {['DSP-10001', 'DSP-10002', 'DSP-10003'].map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => { setTicketIdInput(id); fetchTicketDetails(id); }}
              className="px-2.5 py-1 rounded bg-slate-800 text-emerald-400 font-mono text-[11px] hover:bg-slate-700 transition-colors"
            >
              {id}
            </button>
          ))}
        </div>
      </form>

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs text-center">
          ⚠️ {error}
        </div>
      )}

      {/* Ticket Details & Timeline */}
      {ticketData && (
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-8 shadow-2xl animate-fade-in">
          
          {/* Header Summary */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <span className="text-xs font-mono font-semibold text-slate-400 block mb-1">
                TICKET ID: <span className="text-emerald-400 font-bold">{ticketData.ticket_id}</span>
              </span>
              <h2 className="text-xl font-bold text-white">{ticketData.issue_detected}</h2>
              <span className="text-xs text-slate-400">Filed on: {ticketData.timeline[0]?.date || 'Recent'}</span>
            </div>

            <StatusBadge status={ticketData.status} />
          </div>

          {/* Timeline Visualizer */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Resolution Progress Timeline</h3>

            <div className="relative flex flex-col md:flex-row justify-between gap-4 p-6 bg-slate-950/80 rounded-2xl border border-slate-800">
              
              {ticketData.timeline.map((step, idx) => (
                <div key={idx} className="flex md:flex-col items-center gap-3 relative z-10 text-left md:text-center flex-1">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shadow-md border ${
                    step.completed 
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-emerald-500/20' 
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}>
                    {step.completed ? '✓' : idx + 1}
                  </div>
                  <div>
                    <span className={`text-xs font-semibold block ${step.completed ? 'text-white' : 'text-slate-500'}`}>
                      {step.step}
                    </span>
                    <span className="text-[10px] text-slate-400 block">{step.date}</span>
                  </div>
                </div>
              ))}

            </div>
          </div>

          {/* Ticket Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left Box: Complaint & AI Decision */}
            <div className="space-y-4">
              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[11px] font-semibold uppercase text-slate-400 block">Original Complaint</span>
                <p className="text-xs text-slate-200 font-medium">"{ticketData.complaint}"</p>
              </div>

              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[11px] font-semibold uppercase text-emerald-400 block">AI Resolution Recommendation</span>
                <p className="text-xs text-white font-semibold">{ticketData.ai_recommendation}</p>
              </div>
            </div>

            {/* Right Box: Transaction & Priority */}
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-3">
              <span className="text-[11px] font-semibold uppercase text-slate-400 block">Transaction Audit Data</span>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block">Transaction ID</span>
                  <span className="font-mono text-white font-semibold">{ticketData.transaction.id}</span>
                </div>

                <div>
                  <span className="text-slate-400 block">Amount</span>
                  <span className="font-bold text-emerald-400">₹{ticketData.transaction.amount}</span>
                </div>

                <div>
                  <span className="text-slate-400 block">Gateway Method</span>
                  <span className="text-slate-200">{ticketData.transaction.payment_method}</span>
                </div>

                <div>
                  <span className="text-slate-400 block">System Priority</span>
                  <span className="font-bold text-indigo-300">{ticketData.priority}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <ConfidenceBadge confidence={ticketData.confidence} />
              </div>
            </div>

          </div>

          {/* Policy Citation */}
          {ticketData.relevant_policy && (
            <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800 space-y-1 text-xs">
              <span className="font-semibold text-slate-400 block">Verified Policy Clause</span>
              <p className="text-slate-300 italic">{ticketData.relevant_policy}</p>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
