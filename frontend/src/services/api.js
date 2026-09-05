const API_BASE_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ? (window.location.port === '8000' ? '' : 'http://localhost:8000')
  : window.location.origin;

async function handleResponse(response) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Server error: ${response.status}`);
  }
  return response.json();
}

export const api = {
  // Submit new dispute complaint
  async submitDispute(payload) {
    const response = await fetch(`${API_BASE_URL}/api/disputes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return handleResponse(response);
  },

  // Get disputes for admin dashboard
  async getDisputes(filters = {}) {
    const params = new URLSearchParams();
    if (filters.status && filters.status !== 'ALL') params.append('status', filters.status);
    if (filters.category && filters.category !== 'ALL') params.append('category', filters.category);
    if (filters.priority && filters.priority !== 'ALL') params.append('priority', filters.priority);

    const queryString = params.toString() ? `?${params.toString()}` : '';
    const response = await fetch(`${API_BASE_URL}/api/disputes${queryString}`);
    return handleResponse(response);
  },

  // Track ticket by Ticket ID (DSP-10025)
  async getTicket(ticketId) {
    const response = await fetch(`${API_BASE_URL}/api/tickets/${encodeURIComponent(ticketId)}`);
    return handleResponse(response);
  },

  // Update ticket status / priority (Admin)
  async updateTicketStatus(ticketId, payload) {
    const response = await fetch(`${API_BASE_URL}/api/tickets/${encodeURIComponent(ticketId)}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return handleResponse(response);
  },

  // Get specific dispute details
  async getDisputeDetails(idOrTicket) {
    const response = await fetch(`${API_BASE_URL}/api/disputes/${encodeURIComponent(idOrTicket)}`);
    return handleResponse(response);
  },

  // Get dashboard aggregate metrics
  async getDashboardStats() {
    const response = await fetch(`${API_BASE_URL}/api/stats`);
    return handleResponse(response);
  },

  // Reseed database with fresh demo records
  async seedDatabase() {
    const response = await fetch(`${API_BASE_URL}/api/seed`, {
      method: 'POST'
    });
    return handleResponse(response);
  }
};
