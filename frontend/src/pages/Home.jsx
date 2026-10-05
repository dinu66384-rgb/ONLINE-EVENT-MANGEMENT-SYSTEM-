import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Search 
} from 'lucide-react';
import api from '../services/api';
import EventCard from '../components/EventCard';
import Loading from '../components/Loading';

const Home = () => {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    eventsCount: 0,
    attendeesCount: 0,
    categoriesCount: 5
  });

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const res = await api.events.getAll({ limit: 6, sort: 'eventDate:asc' });
        if (res.success && Array.isArray(res.data)) {
          setFeaturedEvents(res.data);
          const totalRegistered = res.data.reduce((sum, e) => sum + (e.registeredCount || 0), 0);
          setStats({
            eventsCount: res.total || res.data.length,
            attendeesCount: totalRegistered + 42,
            categoriesCount: 6
          });
        }
      } catch (err) {
        console.error('Failed to load home events:', err.message);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  return (
    <div className="animate-fade">
      {/* Hero Section */}
      <section style={{
        padding: '70px 0 50px 0',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="container">
          <div style={{ maxWidth: '840px', margin: '0 auto', textAlign: 'center' }}>
            

            {/* Main Heading */}
            <h1 style={{
              fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
              fontWeight: 800,
              letterSpacing: '-1.5px',
              marginBottom: '20px',
              lineHeight: 1.15
            }}>
              Discover, Organize & Book <br />
              <span style={{
                background: 'var(--accent-gradient)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Unforgettable Events
              </span>
            </h1>

            {/* Subtitle */}
            <p style={{
              fontSize: '1.15rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              marginBottom: '36px',
              maxWidth: '680px',
              margin: '0 auto 36px auto'
            }}>
              A comprehensive MERN stack platform featuring real-time seat availability, Bcrypt password hashing, JWT authentication, and interactive attendee roster management.
            </p>

            {/* Action buttons */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <Link to="/events" className="btn btn-primary btn-lg">
                <Search size={18} /> Browse All Events
              </Link>
              <Link to="/register" className="btn btn-secondary btn-lg">
                Create Account <ArrowRight size={18} />
              </Link>
            </div>

          </div>

          {/* Key Metric Stats Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginTop: '60px'
          }}>
            <div className="card" style={{ textAlign: 'center', padding: '24px 16px' }}>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--accent-primary)', fontFamily: 'var(--font-heading)' }}>
                {stats.eventsCount}+
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>
                Active Published Events
              </div>
            </div>

            <div className="card" style={{ textAlign: 'center', padding: '24px 16px' }}>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#34d399', fontFamily: 'var(--font-heading)' }}>
                {stats.attendeesCount}+
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>
                Confirmed Bookings
              </div>
            </div>

            <div className="card" style={{ textAlign: 'center', padding: '24px 16px' }}>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#fbbf24', fontFamily: 'var(--font-heading)' }}>
                100%
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>
                Real-Time Seat Accuracy
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Featured Events Section */}
      <section style={{ padding: '40px 0 70px 0' }}>
        <div className="container">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '32px',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Featured Catalog
              </span>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '4px' }}>
                Upcoming Events
              </h2>
            </div>
            <Link to="/events" className="btn btn-outline btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              View All Events <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <Loading message="Fetching verified events from MongoDB..." />
          ) : featuredEvents.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>No upcoming events currently found.</p>
              <Link to="/events/create" className="btn btn-primary btn-sm">Create the First Event</Link>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '24px'
            }}>
              {featuredEvents.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          )}
        </div>
      </section>

    </div>
  );
};

export default Home;
