import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import ConfidenceBadge from '../components/ConfidenceBadge';

export default function DisputeFormPage() {
  const navigate = useNavigate();

  const [customerId, setCustomerId] = useState('C001');
  const [transactionId, setTransactionId] = useState('TXN1001');
  const [complaintText, setComplaintText] = useState('My money was deducted but my order failed.');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  // Preset demo scenario handlers
  const loadScenario = (scenarioNum) => {
    setError(null);
    setResult(null);

    if (scenarioNum === 1) {
      setCustomerId('C001');
      setTransactionId('TXN1001');
      setComplaintText('My money was deducted but my order failed.');
    } else if (scenarioNum === 2) {
      setCustomerId('C002');
      setTransactionId('TXN1002');
      setComplaintText("My order was cancelled but I haven't received my refund.");
    } else if (scenarioNum === 3) {
      setCustomerId('C008');
      setTransactionId('TXN1009');
      setComplaintText("I don't recognize this transaction of ₹9999 on my account.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerId.trim() || !transactionId.trim() || !complaintText.trim()) {
      setError('Please fill in all form fields.');
      return;
    }

    setError(null);
    setLoading(true);
    setResult(null);

    try {
      const data = await api.submitDispute({
        customer_id: customerId.trim(),
        transaction_id: transactionId.trim(),
        complaint_text: complaintText.trim()
      });
      setResult(data);
    } catch (err) {
      setError(err.message || 'Failed to analyze dispute. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Submit Payment Dispute</h1>
        <p className="text-sm text-slate-400">
          Enter your transaction details below. Our AI agent will cross-verify logs and policies to resolve your claim immediately.
        </p>
      </div>

      {/* Preset Demo Scenarios Selector */}
      <div className="glass-card p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <span className="text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
          <span className="text-emerald-400 font-bold">⚡ Quick Test Scenarios:</span>
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => loadScenario(1)}
            className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all font-medium"
          >
            Scenario 1: Money Deducted & Order Failed
          </button>
          <button
            type="button"
            onClick={() => loadScenario(2)}
            className="px-3 py-1.5 rounded-lg bg-teal-500/10 text-teal-300 border border-teal-500/20 hover:bg-teal-500/20 transition-all font-medium"
          >
            Scenario 2: Cancelled Order Refund Delay
          </button>
          <button
            type="button"
            onClick={() => loadScenario(3)}
            className="px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-300 border border-rose-500/20 hover:bg-rose-500/20 transition-all font-medium"
          >
            Scenario 3: Unauthorized Transaction
          </button>
        </div>
      </div>

      {/* Main Dispute Form */}
      {!result && (
        <form onSubmit={handleSubmit} className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 shadow-2xl">
          
          {error && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Customer ID */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Customer ID <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                placeholder="e.g. C001"
                className="w-full px-4 py-3 rounded-xl glass-input text-sm text-white placeholder-slate-500 transition-all"
                required
              />
              <span className="text-[11px] text-slate-400 mt-1 block">Try C001, C002, or C008</span>
            </div>

            {/* Transaction ID */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Transaction ID <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="e.g. TXN1001"
                className="w-full px-4 py-3 rounded-xl glass-input text-sm text-white placeholder-slate-500 transition-all"
                required
              />
              <span className="text-[11px] text-slate-400 mt-1 block">Try TXN1001, TXN1002, or TXN1009</span>
            </div>

          </div>

          {/* Complaint Textarea */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Complaint Description <span className="text-rose-400">*</span>
            </label>
            <textarea
              rows="4"
              value={complaintText}
              onChange={(e) => setComplaintText(e.target.value)}
              placeholder="My money was deducted but my order failed."
              className="w-full px-4 py-3 rounded-xl glass-input text-sm text-white placeholder-slate-500 transition-all"
              required
            ></textarea>
            <span className="text-[11px] text-slate-400 mt-1 block">Describe what happened with your payment or order.</span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 hover:opacity-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>AI is analyzing your dispute...</span>
              </>
            ) : (
              <>
                <span>Analyze My Dispute</span>
                <span>→</span>
              </>
            )}
          </button>

        </form>
      )}

      {/* Loading Animation Card */}
      {loading && (
        <div className="glass-card p-12 rounded-3xl border border-slate-800 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto animate-pulse">
            <svg className="w-8 h-8 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m0 14v1m8-8h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white">AI Engine Processing</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Cross-referencing database transaction status, evaluating RAG policy documents, and determining refund eligibility...
          </p>
        </div>
      )}

      {/* AI Analysis Result Card */}
      {result && (
        <div className="glass-card p-6 sm:p-10 rounded-3xl border border-emerald-500/30 space-y-8 shadow-2xl animate-fade-in relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-3xl pointer-events-none"></div>

          {/* Result Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Analysis Complete</span>
                <span className="text-slate-600">•</span>
                <span className="text-xs font-mono text-slate-400">Ticket: <strong className="text-white">{result.dispute.ticket_id}</strong></span>
              </div>
              <h2 className="text-2xl font-extrabold text-white">Dispute Analysis Result</h2>
            </div>
            
            <div className="flex items-center gap-3">
              <StatusBadge status={result.dispute.status} />
              <button
                onClick={() => { setResult(null); }}
                className="px-3 py-1.5 rounded-xl bg-slate-800 text-xs font-medium text-slate-300 hover:text-white"
              >
                File Another
              </button>
            </div>
          </div>

          {/* Original Complaint & Detected Issue */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">Customer Complaint</span>
              <p className="text-sm text-slate-200 font-medium">"{result.dispute.complaint_text}"</p>
            </div>

            <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400 block">Issue Detected</span>
              <p className="text-base font-bold text-white">{result.dispute.issue_detected}</p>
              <span className="inline-block text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                Category: {result.dispute.category}
              </span>
            </div>

          </div>

          {/* Database Verification Grid */}
          <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <span>🔍</span>
              <span>Database & Gateway Verification</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              
              <div>
                <span className="text-slate-400 block mb-0.5">Transaction ID</span>
                <span className="font-mono font-bold text-white">{result.transaction_details.id}</span>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">Amount</span>
                <span className="font-bold text-emerald-400 text-sm">₹{result.transaction_details.amount}</span>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">Payment Gateway Status</span>
                <span className={`font-semibold ${result.transaction_details.status === 'SUCCESS' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {result.transaction_details.status}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">Order Fulfillment</span>
                <span className={`font-semibold ${result.transaction_details.order_status === 'FAILED' || result.transaction_details.order_status === 'CANCELLED' ? 'text-rose-400' : 'text-slate-200'}`}>
                  {result.transaction_details.order_status}
                </span>
              </div>

            </div>
          </div>

          {/* AI Decision Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* AI Confidence */}
            <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-2 flex flex-col justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">AI Confidence</span>
              <ConfidenceBadge confidence={result.dispute.confidence} />
            </div>

            {/* Refund Eligibility */}
            <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">Refund Eligibility</span>
              <StatusBadge status={result.dispute.refund_eligibility} />
            </div>

            {/* Resolution Action */}
            <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">Resolution Action</span>
              <p className={`text-base font-bold ${result.dispute.resolution_action.includes('Refund') ? 'text-emerald-400' : 'text-amber-400'}`}>
                {result.dispute.resolution_action}
              </p>
            </div>

          </div>

          {/* AI Recommendation & Policy Excerpt */}
          <div className="space-y-4">
            
            <div className="bg-emerald-500/10 p-5 rounded-2xl border border-emerald-500/20 space-y-1">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">AI Recommendation</span>
              <p className="text-sm font-semibold text-white">{result.dispute.ai_recommendation}</p>
            </div>

            {result.dispute.relevant_policy && (
              <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span>📚</span>
                  <span>Retrieved RAG Policy Clause</span>
                </span>
                <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed italic bg-slate-950/60 p-4 rounded-xl border border-slate-850">
                  {result.dispute.relevant_policy}
                </p>
              </div>
            )}

          </div>

          {/* Ticket Footer Action */}
          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-400">
              Dispute registered under Ticket ID: <strong className="text-white font-mono">{result.dispute.ticket_id}</strong>
            </div>

            <button
              onClick={() => navigate(`/track?ticket=${result.dispute.ticket_id}`)}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xs hover:opacity-95 transition-all shadow-md"
            >
              Track Ticket Progress →
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
