/**
 * API Service for Online Event Management System (MERN Stack)
 * Connects React frontend with Express/Node.js backend
 */

const API_BASE_URL = '/api';

/**
 * Universal fetch wrapper that attaches JWT token and parses JSON responses
 */
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.message || (Array.isArray(data.errors) ? data.errors.join(', ') : 'Request failed');
    throw new Error(errorMsg);
  }

  return data;
}

export const api = {
  // Authentication (Week 7)
  auth: {
    register: (userData) =>
      request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
      }),

    login: (credentials) =>
      request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
      }),

    getMe: () => request('/auth/me'),

    logout: () =>
      request('/auth/logout', {
        method: 'POST'
      })
  },

  // Events (Weeks 3, 5, 6)
  events: {
    getAll: (params = {}) => {
      const query = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          query.append(key, val);
        }
      });
      const queryString = query.toString() ? `?${query.toString()}` : '';
      return request(`/events${queryString}`);
    },

    getById: (id) => request(`/events/${id}`),

    create: (eventData) =>
      request('/events', {
        method: 'POST',
        body: JSON.stringify(eventData)
      }),

    update: (id, eventData) =>
      request(`/events/${id}`, {
        method: 'PUT',
        body: JSON.stringify(eventData)
      }),

    delete: (id) =>
      request(`/events/${id}`, {
        method: 'DELETE'
      })
  },

  // Bookings / Registrations (Week 6)
  bookings: {
    create: (bookingData) =>
      request('/bookings', {
        method: 'POST',
        body: JSON.stringify(bookingData)
      }),

    getMyBookings: () => request('/bookings/my-bookings'),

    getAttendees: (eventId) => request(`/bookings/event/${eventId}`),

    cancel: (id) =>
      request(`/bookings/${id}`, {
        method: 'DELETE'
      })
  },

  // Users (Week 6 & 7)
  users: {
    getAll: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/users${query ? `?${query}` : ''}`);
    },

    getById: (id) => request(`/users/${id}`),

    updateProfile: (id, data) =>
      request(`/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      }),

    delete: (id) =>
      request(`/users/${id}`, {
        method: 'DELETE'
      })
  },

  // Health check
  status: () => request('/status')
};

export default api;
