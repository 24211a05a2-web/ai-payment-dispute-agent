import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import ConfidenceBadge from '../components/ConfidenceBadge';

export default function AdminDashboardPage() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    total_disputes: 0,
    resolved_disputes: 0,
    pending_disputes: 0,
    escalated_disputes: 0,
    total_refunded_amount: 0.0
  });

  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter States
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Status update modal state
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [updateStatus, setUpdateStatus] = useState('RESOLVED');
  const [updatePriority, setUpdatePriority] = useState('HIGH');
  const [updating, setUpdating] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsData, disputesData] = await Promise.all([
        api.getDashboardStats(),
        api.getDisputes({
          status: statusFilter,
          category: categoryFilter,
          priority: priorityFilter
        })
      ]);
      setStats(statsData);
      setDisputes(disputesData);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [statusFilter, categoryFilter, priorityFilter]);

  const handleUpdateTicket = async (e) => {
    e.preventDefault();
    if (!selectedDispute) return;

    setUpdating(true);
    try {
      await api.updateTicketStatus(selectedDispute.ticket_id, {
        status: updateStatus,
        priority: updatePriority
      });
      setSelectedDispute(null);
      await loadData();
    } catch (err) {
      alert(`Error updating ticket: ${err.message}`);
    } finally {
      setUpdating(false);
    }
  };

  const handleReseed = async () => {
    if (window.confirm('Re-seed database with fresh demo records?')) {
      await api.seedDatabase();
      await loadData();
    }
  };

  const filteredDisputes = disputes.filter((d) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      d.ticket_id.toLowerCase().includes(q) ||
      d.customer_id.toLowerCase().includes(q) ||
      (d.transaction_id && d.transaction_id.toLowerCase().includes(q)) ||
      d.issue_detected.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <span>Admin Resolution Dashboard</span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
              LIVE GATEWAY
            </span>
          </h1>
          <p className="text-xs text-slate-400">Monitor disputes, audit AI decision matrix, and manage escalated fraud claims.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors flex items-center gap-1.5"
          >
            <span>🔄 Refresh</span>
          </button>
          <button
            onClick={handleReseed}
            className="px-4 py-2 rounded-xl bg-indigo-500/10 text-xs font-semibold text-indigo-300 border border-indigo-500/20 hover:bg-indigo-500/20 transition-colors"
          >
            🌱 Reset Demo Data
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        
        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Total Disputes</span>
          <p className="text-2xl font-extrabold text-white">{stats.total_disputes}</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-emerald-500/20 space-y-1">
          <span className="text-xs text-emerald-400 font-medium">Resolved</span>
          <p className="text-2xl font-extrabold text-emerald-400">{stats.resolved_disputes}</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-amber-500/20 space-y-1">
          <span className="text-xs text-amber-400 font-medium">Pending Review</span>
          <p className="text-2xl font-extrabold text-amber-300">{stats.pending_disputes}</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-rose-500/20 space-y-1">
          <span className="text-xs text-rose-400 font-medium">Escalated (Fraud)</span>
          <p className="text-2xl font-extrabold text-rose-400">{stats.escalated_disputes}</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-teal-500/20 space-y-1 col-span-2 md:col-span-1">
          <span className="text-xs text-teal-400 font-medium">Total Refunded</span>
          <p className="text-2xl font-extrabold text-teal-300">₹{stats.total_refunded_amount}</p>
        </div>

      </div>

      {/* Filters Bar */}
      <div className="glass-card p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-4">
        
        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          
          <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
            {['ALL', 'PENDING', 'ESCALATED', 'RESOLVED'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  statusFilter === st 
                    ? 'bg-emerald-500 text-slate-950 shadow-sm' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="w-full sm:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Ticket ID or Customer..."
              className="w-full px-4 py-2 rounded-xl glass-input text-xs text-white placeholder-slate-500"
            />
          </div>

        </div>

        {/* Dropdown Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2 border-t border-slate-800/60">
          <div>
            <label className="text-slate-400 block mb-1 font-semibold uppercase tracking-wider text-[10px]">Category Filter</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl glass-input text-slate-200 text-xs"
            >
              <option value="ALL">All Categories</option>
              <option value="PAYMENT_DEDUCTED_ORDER_FAILED">Payment Deducted — Order Failed</option>
              <option value="REFUND_NOT_RECEIVED">Refund Not Received</option>
              <option value="UNAUTHORIZED_TRANSACTION">Unauthorized Transaction</option>
              <option value="DUPLICATE_PAYMENT">Duplicate Payment</option>
              <option value="PAYMENT_FAILED">Payment Failed</option>
            </select>
          </div>

          <div>
            <label className="text-slate-400 block mb-1 font-semibold uppercase tracking-wider text-[10px]">Priority Filter</label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl glass-input text-slate-200 text-xs"
            >
              <option value="ALL">All Priorities</option>
              <option value="CRITICAL">Critical Priority</option>
              <option value="HIGH">High Priority</option>
              <option value="MEDIUM">Medium Priority</option>
              <option value="LOW">Low Priority</option>
            </select>
          </div>
        </div>

      </div>

      {/* Recent Disputes Table */}
      <div className="glass-card rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Disputes Management Table</h3>
          <span className="text-xs text-slate-400">{filteredDisputes.length} records displayed</span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">Loading dispute records...</div>
        ) : filteredDisputes.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">No matching dispute tickets found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/90 text-slate-400 uppercase text-[10px] tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Ticket ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Txn ID</th>
                  <th className="px-6 py-4">Issue Detected</th>
                  <th className="px-6 py-4">Priority</th>
                  <th className="px-6 py-4">Confidence</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredDisputes.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-emerald-400">{d.ticket_id}</td>
                    <td className="px-6 py-4 font-medium text-white">{d.customer_id}</td>
                    <td className="px-6 py-4 font-mono text-slate-400">{d.transaction_id || 'N/A'}</td>
                    <td className="px-6 py-4 font-medium text-slate-200 max-w-xs truncate">{d.issue_detected}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        d.priority === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                        d.priority === 'HIGH' ? 'bg-amber-500/20 text-amber-300' :
                        'bg-slate-800 text-slate-400'
                      }`}>
                        {d.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-200">{d.confidence}%</td>
                    <td className="px-6 py-4"><StatusBadge status={d.status} /></td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => navigate(`/dispute-details/${d.ticket_id}`)}
                        className="px-3 py-1 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors text-[11px]"
                      >
                        Inspect
                      </button>
                      <button
                        onClick={() => {
                          setSelectedDispute(d);
                          setUpdateStatus(d.status);
                          setUpdatePriority(d.priority);
                        }}
                        className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors text-[11px]"
                      >
                        Action
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Update Ticket Action Modal */}
      {selectedDispute && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card p-6 rounded-3xl border border-slate-800 max-w-md w-full space-y-6 shadow-2xl">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">Update Ticket #{selectedDispute.ticket_id}</h3>
              <button onClick={() => setSelectedDispute(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleUpdateTicket} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Change Resolution Status</label>
                <select
                  value={updateStatus}
                  onChange={(e) => setUpdateStatus(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl glass-input text-white text-xs"
                >
                  <option value="RESOLVED">RESOLVED (Close Ticket)</option>
                  <option value="REFUND_INITIATED">REFUND_INITIATED (Process Refund)</option>
                  <option value="ESCALATED">ESCALATED (Flag Fraud/Review)</option>
                  <option value="UNDER_REVIEW">UNDER_REVIEW (In Progress)</option>
                  <option value="REJECTED">REJECTED (Decline Claim)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Set Priority Level</label>
                <select
                  value={updatePriority}
                  onChange={(e) => setUpdatePriority(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl glass-input text-white text-xs"
                >
                  <option value="LOW font-semibold">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                  <option value="CRITICAL">CRITICAL</option>
                </select>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedDispute(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-5 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400"
                >
                  {updating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
