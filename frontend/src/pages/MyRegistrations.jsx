import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Ticket, Calendar, Clock, MapPin, XCircle, ArrowRight, QrCode } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';

const MyRegistrations = () => {
  const { isAuthenticated, showToast } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const res = await api.bookings.getMyBookings();
      if (res.success) {
        setBookings(res.data || []);
      }
    } catch (err) {
      showToast(err.message || 'Failed to fetch bookings', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchBookings();
    }
  }, [isAuthenticated]);

  const handleCancelBooking = async (bookingId, eventTitle) => {
    if (!window.confirm(`Are you sure you want to cancel your reservation for "${eventTitle}"? Your seats will be released back to the event.`)) {
      return;
    }

    try {
      const res = await api.bookings.cancel(bookingId);
      if (res.success) {
        showToast('Booking cancelled successfully and seats released.', 'info');
        fetchBookings();
      }
    } catch (err) {
      showToast(err.message || 'Failed to cancel booking', 'error');
    }
  };

  if (loading) {
    return <Loading message="Loading your tickets and reservations..." />;
  }

  return (
    <div className="container animate-fade" style={{ padding: '40px 24px 80px 24px' }}>
      
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>My Event Bookings</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
          Manage your confirmed event tickets, access details, or release seats if plans change.
        </p>
      </div>

      {bookings.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <Ticket size={48} color="var(--accent-primary)" style={{ margin: '0 auto 16px auto', opacity: 0.8 }} />
          <h3 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>No Active Registrations Found</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', maxWidth: '440px', margin: '0 auto 24px auto' }}>
            You haven't booked any event tickets yet. Explore upcoming conferences, workshops, and networking summits!
          </p>
          <Link to="/events" className="btn btn-primary">
            Browse Event Catalog
          </Link>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
          gap: '24px'
        }}>
          {bookings.map((booking) => {
            const ev = booking.event;
            if (!ev) return null;

            const isCancelled = booking.status === 'cancelled';
            const formattedDate = new Date(ev.eventDate).toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            });

            return (
              <div key={booking._id} className="card" style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: isCancelled ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid rgba(99, 102, 241, 0.25)',
                opacity: isCancelled ? 0.6 : 1
              }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <span className={`badge ${isCancelled ? 'badge-cancelled' : 'badge-workshop'}`}>
                      {booking.status.toUpperCase()}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Booked {new Date(booking.registrationDate || booking.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '12px' }}>
                    <Link to={`/events/${ev._id}`} style={{ color: 'white' }}>
                      {ev.title}
                    </Link>
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.86rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Calendar size={15} color="#818cf8" />
                      <span>{formattedDate}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Clock size={15} color="#818cf8" />
                      <span>{ev.eventTime}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <MapPin size={15} color="#818cf8" />
                      <span>{ev.location}</span>
                    </div>
                  </div>

                  {/* Ticket Badge */}
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px dashed var(--border-subtle)',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px'
                  }}>
                    <div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>Reserved Seats</span>
                      <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#38bdf8' }}>
                        {booking.ticketQuantity} {booking.ticketQuantity > 1 ? 'Tickets' : 'Ticket'}
                      </span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>Pass ID</span>
                      <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
                        #{booking._id.slice(-6).toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
                  <Link to={`/events/${ev._id}`} className="btn btn-secondary btn-sm">
                    View Event <ArrowRight size={14} />
                  </Link>

                  {!isCancelled && (
                    <button 
                      onClick={() => handleCancelBooking(booking._id, ev.title)}
                      className="btn btn-outline btn-sm"
                      style={{ color: '#f87171', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                    >
                      <XCircle size={14} /> Cancel
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default MyRegistrations;
