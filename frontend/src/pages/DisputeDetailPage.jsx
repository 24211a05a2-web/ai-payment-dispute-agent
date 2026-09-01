import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import ConfidenceBadge from '../components/ConfidenceBadge';

export default function DisputeDetailPage() {
  const { ticketId } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  const loadDispute = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getDisputeDetails(ticketId);
      setData(res);
    } catch (err) {
      setError(err.message || `Dispute ticket '${ticketId}' not found.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDispute();
  }, [ticketId]);

  const handleStatusChange = async (newStatus) => {
    if (!data || !data.dispute) return;
    setUpdating(true);
    try {
      await api.updateTicketStatus(data.dispute.ticket_id, {
        status: newStatus,
        priority: data.dispute.priority
      });
      await loadDispute();
    } catch (err) {
      alert(`Error updating ticket status: ${err.message}`);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="max-w-4xl mx-auto px-4 py-20 text-center text-slate-400 text-xs">Loading audit details...</div>;
  }

  if (error || !data) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
          ⚠️ {error}
        </div>
        <button onClick={() => navigate('/dashboard')} className="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs">
          Back to Dashboard
        </button>
      </div>
    );
  }

  const { dispute, customer, transaction } = data;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      
      {/* Back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/dashboard')}
          className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white flex items-center gap-2"
        >
          <span>←</span>
          <span>Back to Dashboard</span>
        </button>

        <StatusBadge status={dispute.status} />
      </div>

      {/* Main Container */}
      <div className="glass-card p-6 sm:p-10 rounded-3xl border border-slate-800 space-y-8 shadow-2xl">
        
        {/* Header */}
        <div className="pb-6 border-b border-slate-800 space-y-1">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold text-emerald-400">TICKET: {dispute.ticket_id}</span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-400">Priority: <strong className="text-white">{dispute.priority}</strong></span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">{dispute.issue_detected}</h1>
        </div>

        {/* Section 1: Customer Complaint */}
        <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">1. Customer Complaint</span>
          <p className="text-sm text-slate-100 font-medium">"{dispute.complaint_text}"</p>
        </div>

        {/* Section 2: AI Classification */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 block">Category</span>
            <span className="text-xs font-bold text-indigo-300">{dispute.category}</span>
          </div>

          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 block">AI Confidence</span>
            <ConfidenceBadge confidence={dispute.confidence} />
          </div>

          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 block">Detected Intent</span>
            <span className="text-xs font-medium text-slate-200">{dispute.issue_detected}</span>
          </div>
        </div>

        {/* Section 3: Transaction Verification */}
        <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">2. Database & Gateway Verification</h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block">Customer ID</span>
              <span className="font-semibold text-white">{customer ? customer.name : dispute.customer_id} ({dispute.customer_id})</span>
            </div>
            <div>
              <span className="text-slate-400 block">Transaction ID</span>
              <span className="font-mono text-emerald-400 font-bold">{dispute.transaction_id || 'N/A'}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Amount</span>
              <span className="font-bold text-white">₹{transaction ? transaction.amount : 0}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Gateway Status</span>
              <span className="font-bold text-emerald-400">{transaction ? transaction.status : 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Section 4: RAG Policy */}
        {dispute.relevant_policy && (
          <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">3. RAG Policy Excerpt</h3>
            <p className="text-xs text-slate-300 italic whitespace-pre-line bg-slate-950 p-4 rounded-xl border border-slate-850">
              {dispute.relevant_policy}
            </p>
          </div>
        )}

        {/* Section 5: AI Decision */}
        <div className="bg-emerald-500/10 p-6 rounded-2xl border border-emerald-500/20 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">4. AI Decision & Recommendation</h3>
          <p className="text-sm font-semibold text-white">{dispute.ai_recommendation}</p>
          <div className="flex items-center gap-3 text-xs pt-2">
            <span className="text-slate-400">Refund Eligibility:</span>
            <StatusBadge status={dispute.refund_eligibility} />
          </div>
        </div>

        {/* Section 6: Resolution Admin Actions */}
        <div className="pt-6 border-t border-slate-800 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">5. Manual Resolution Override</h3>
          <div className="flex flex-wrap items-center gap-3">
            <button
              disabled={updating}
              onClick={() => handleStatusChange('RESOLVED')}
              className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-colors"
            >
              Approve & Resolve Ticket
            </button>
            <button
              disabled={updating}
              onClick={() => handleStatusChange('REFUND_INITIATED')}
              className="px-4 py-2 rounded-xl bg-teal-600 text-white font-bold text-xs hover:bg-teal-500 transition-colors"
            >
              Trigger Refund
            </button>
            <button
              disabled={updating}
              onClick={() => handleStatusChange('ESCALATED')}
              className="px-4 py-2 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold hover:bg-rose-500/30 transition-colors"
            >
              Escalate to Fraud Audit
            </button>
            <button
              disabled={updating}
              onClick={() => handleStatusChange('REJECTED')}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition-colors"
            >
              Reject Claim
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
