import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Tag, 
  ShieldCheck, 
  Ticket, 
  Trash2, 
  Edit, 
  ArrowLeft,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, showToast } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [attendees, setAttendees] = useState([]);
  const [loadingAttendees, setLoadingAttendees] = useState(false);

  // Booking Form State
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [bookingInProgress, setBookingInProgress] = useState(false);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);

  const fetchEventData = async () => {
    try {
      const res = await api.events.getById(id);
      if (res.success && res.data) {
        setEvent(res.data);
      }
    } catch (err) {
      showToast(err.message || 'Failed to load event details', 'error');
      navigate('/events');
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendeesData = async () => {
    setLoadingAttendees(true);
    try {
      const res = await api.bookings.getAttendees(id);
      if (res.success) {
        setAttendees(res.data || []);
      }
    } catch (err) {
      // User may not be authorized to view attendees
    } finally {
      setLoadingAttendees(false);
    }
  };

  const checkMyRegistration = async () => {
    if (!isAuthenticated) return;
    try {
      const res = await api.bookings.getMyBookings();
      if (res.success && Array.isArray(res.data)) {
        const found = res.data.some((b) => b.event?._id === id && b.status === 'confirmed');
        setAlreadyRegistered(found);
      }
    } catch (err) {
      // Ignore
    }
  };

  useEffect(() => {
    fetchEventData();
    checkMyRegistration();
  }, [id, isAuthenticated]);

  useEffect(() => {
    const isOwner = user && event?.organizer && (event.organizer._id === user._id || event.organizer === user._id);
    const isAdmin = user?.role === 'admin';
    if (isOwner || isAdmin) {
      fetchAttendeesData();
    }
  }, [event, user]);

  const handleBookTicket = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      showToast('Please sign in or create an account to book tickets.', 'warning');
      navigate('/login');
      return;
    }

    setBookingInProgress(true);
    try {
      const payload = {
        eventId: id,
        ticketQuantity: parseInt(ticketQuantity, 10),
        notes: notes.trim()
      };
      const res = await api.bookings.create(payload);
      if (res.success) {
        showToast('Registration confirmed! Your tickets are reserved.', 'success');
        setAlreadyRegistered(true);
        fetchEventData();
      }
    } catch (err) {
      showToast(err.message || 'Booking failed', 'error');
    } finally {
      setBookingInProgress(false);
    }
  };

  const handleDeleteEvent = async () => {
    if (!window.confirm('Are you sure you want to delete this event? All attendee registrations will be removed.')) {
      return;
    }
    try {
      const res = await api.events.delete(id);
      if (res.success) {
        showToast('Event deleted successfully.', 'info');
        navigate('/events');
      }
    } catch (err) {
      showToast(err.message || 'Failed to delete event', 'error');
    }
  };

  if (loading) {
    return <Loading message="Loading event details..." />;
  }

  if (!event) {
    return null;
  }

  const isOwnerOrAdmin = user && (event.organizer?._id === user._id || event.organizer === user._id || user.role === 'admin');
  const availableSeats = Math.max(0, event.capacity - (event.registeredCount || 0));
  const isFull = availableSeats <= 0;
  const totalPrice = (event.price || 0) * ticketQuantity;

  const formattedDate = new Date(event.eventDate).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="container animate-fade" style={{ padding: '40px 24px 80px 24px' }}>
      
      {/* Back link */}
      <Link to="/events" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.9rem' }}>
        <ArrowLeft size={16} /> Back to Catalog
      </Link>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 2fr) minmax(320px, 1fr)',
        gap: '36px',
        alignItems: 'start'
      }}>
        
        {/* Left Column: Details & Overview */}
        <div>
          {/* Category & Status header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <span className={`badge badge-${event.category?.toLowerCase()}`}>
              <Tag size={12} /> {event.category}
            </span>
            <span className={`badge badge-${event.status}`}>
              {event.status}
            </span>
          </div>

          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '20px', lineHeight: 1.25 }}>
            {event.title}
          </h1>

          {/* Key metadata grid */}
          <div className="card" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '32px',
            padding: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ background: 'var(--bg-card-hover)', border: '1px solid var(--border-subtle)', padding: '10px', borderRadius: '10px', color: 'var(--accent-primary)' }}>
                <Calendar size={20} />
              </div>
              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>Date</span>
                <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>{formattedDate}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ background: 'var(--bg-card-hover)', border: '1px solid var(--border-subtle)', padding: '10px', borderRadius: '10px', color: 'var(--accent-primary)' }}>
                <Clock size={20} />
              </div>
              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>Time</span>
                <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>{event.eventTime}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ background: 'var(--bg-card-hover)', border: '1px solid var(--border-subtle)', padding: '10px', borderRadius: '10px', color: 'var(--accent-primary)' }}>
                <MapPin size={20} />
              </div>
              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>Location</span>
                <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>{event.location}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ background: 'var(--bg-card-hover)', border: '1px solid var(--border-subtle)', padding: '10px', borderRadius: '10px', color: 'var(--accent-primary)' }}>
                <Users size={20} />
              </div>
              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>Capacity</span>
                <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {event.registeredCount || 0} / {event.capacity} Registered
                </span>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="card" style={{ marginBottom: '32px', padding: '30px' }}>
            <h2 style={{ fontSize: '1.35rem', marginBottom: '16px' }}>About This Event</h2>
            <div style={{ color: '#cbd5e1', fontSize: '1rem', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
              {event.description}
            </div>

            {/* Tags */}
            {event.tags && event.tags.length > 0 && (
              <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)', fontWeight: 600 }}>Tags:</span>
                {event.tags.map((t, idx) => (
                  <span key={idx} style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.8rem',
                    color: '#94a3b8',
                    border: '1px solid var(--border-subtle)'
                  }}>
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Organizer Card */}
          <div className="card" style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, display: 'block' }}>
                Event Host & Organizer
              </span>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white', marginTop: '4px' }}>
                {event.organizer?.name || 'Verified Organizer'}
              </div>
              <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                {event.organizer?.email || 'organizer@eventflow.com'}
              </div>
            </div>

            {isOwnerOrAdmin && (
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={handleDeleteEvent} className="btn btn-danger btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Trash2 size={14} /> Delete Event
                </button>
              </div>
            )}
          </div>

          {/* Organizer Attendee Roster Section */}
          {isOwnerOrAdmin && (
            <div className="card" style={{ padding: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Registered Attendees</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                    Real-time participant roster for event check-in ({attendees.length} registered)
                  </p>
                </div>
              </div>

              {loadingAttendees ? (
                <Loading message="Loading attendees..." />
              ) : attendees.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No attendees have booked tickets yet.</p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                        <th style={{ padding: '10px 12px' }}>Attendee</th>
                        <th style={{ padding: '10px 12px' }}>Email</th>
                        <th style={{ padding: '10px 12px' }}>Tickets</th>
                        <th style={{ padding: '10px 12px' }}>Registered At</th>
                        <th style={{ padding: '10px 12px' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendees.map((att) => (
                        <tr key={att._id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                          <td style={{ padding: '12px', fontWeight: 600, color: 'white' }}>{att.user?.name || 'Attendee'}</td>
                          <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{att.user?.email}</td>
                          <td style={{ padding: '12px', fontWeight: 600 }}>{att.ticketQuantity}</td>
                          <td style={{ padding: '12px', color: 'var(--text-muted)' }}>
                            {new Date(att.registrationDate || att.createdAt).toLocaleDateString()}
                          </td>
                          <td style={{ padding: '12px' }}>
                            <span className="badge badge-ongoing">{att.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Right Column: Ticket Reservation Widget */}
        <div style={{ position: 'sticky', top: '90px' }}>
          <div className="card" style={{ padding: '30px', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Registration Fee</span>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: event.price > 0 ? '#ffffff' : '#10b981' }}>
                  {event.price > 0 ? `$${Number(event.price).toFixed(2)}` : 'FREE'}
                </div>
              </div>
              <span className={`badge ${isFull ? 'badge-cancelled' : 'badge-workshop'}`}>
                {isFull ? 'Sold Out' : `${availableSeats} Seats Left`}
              </span>
            </div>

            {/* Capacity Progress Bar */}
            <div style={{ marginBottom: '24px' }}>
              <div className="progress-container" style={{ height: '10px' }}>
                <div 
                  className={`progress-bar ${isFull ? 'progress-bar-warning' : ''}`}
                  style={{ width: `${Math.min(100, Math.round(((event.registeredCount || 0) / event.capacity) * 100))}%` }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                <span>{event.registeredCount || 0} claimed</span>
                <span>{event.capacity} total max</span>
              </div>
            </div>

            {alreadyRegistered ? (
              <div style={{
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                padding: '20px',
                borderRadius: 'var(--radius-md)',
                textAlign: 'center'
              }}>
                <CheckCircle size={32} color="#10b981" style={{ margin: '0 auto 10px auto' }} />
                <h4 style={{ color: '#34d399', marginBottom: '6px' }}>You Are Registered!</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                  You have a confirmed booking for this event. View your ticket in your dashboard.
                </p>
                <Link to="/my-registrations" className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                  View My Tickets
                </Link>
              </div>
            ) : isFull ? (
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                padding: '20px',
                borderRadius: 'var(--radius-md)',
                textAlign: 'center'
              }}>
                <AlertCircle size={32} color="#ef4444" style={{ margin: '0 auto 10px auto' }} />
                <h4 style={{ color: '#f87171', marginBottom: '4px' }}>Event Capacity Reached</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  All tickets have been booked for this session. Please check back if a participant cancels.
                </p>
              </div>
            ) : (
              <form onSubmit={handleBookTicket}>
                <div className="form-group">
                  <label className="form-label">Number of Tickets</label>
                  <select 
                    className="form-select"
                    value={ticketQuantity}
                    onChange={(e) => setTicketQuantity(e.target.value)}
                  >
                    {[...Array(Math.min(10, availableSeats)).keys()].map((num) => (
                      <option key={num + 1} value={num + 1}>
                        {num + 1} {num === 0 ? 'Ticket' : 'Tickets'}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Special Notes / Requirements (Optional)</label>
                  <textarea 
                    className="form-textarea"
                    placeholder="Dietary preferences, accessibility requirements, etc."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    style={{ minHeight: '80px' }}
                  />
                </div>

                {event.price > 0 && (
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '12px 0',
                    borderTop: '1px solid var(--border-subtle)',
                    marginBottom: '16px',
                    fontSize: '0.95rem'
                  }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Total Amount:</span>
                    <span style={{ fontWeight: 800, color: 'white' }}>${totalPrice.toFixed(2)}</span>
                  </div>
                )}

                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  style={{ width: '100%' }}
                  disabled={bookingInProgress}
                >
                  <Ticket size={18} /> {bookingInProgress ? 'Securing Spot...' : 'Confirm Registration'}
                </button>
              </form>
            )}

          </div>
        </div>

      </div>

    </div>
  );
};

export default EventDetails;
