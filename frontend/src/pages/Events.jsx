import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, PlusCircle, ArrowUpDown, RefreshCw } from 'lucide-react';
import api from '../services/api';
import EventCard from '../components/EventCard';
import Loading from '../components/Loading';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = [
  'All',
  'Tech',
  'Workshop',
  'Seminar',
  'Conference',
  'Networking',
  'Webinar',
  'Festival',
  'Sports'
];

const Events = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [sortBy, setSortBy] = useState('eventDate:asc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 9,
        sort: sortBy
      };

      if (searchTerm.trim()) {
        params.search = searchTerm.trim();
      }

      if (selectedCategory && selectedCategory !== 'All') {
        params.category = selectedCategory;
      }

      const res = await api.events.getAll(params);
      if (res.success) {
        setEvents(res.data || []);
        setTotalPages(res.pages || 1);
        setTotalCount(res.total || 0);
      }
    } catch (err) {
      console.error('Error fetching events:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [selectedCategory, sortBy, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchEvents();
  };

  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat);
    setPage(1);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSortBy('eventDate:asc');
    setPage(1);
  };

  return (
    <div className="container animate-fade" style={{ padding: '40px 24px 80px 24px' }}>
      
      {/* Top Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px',
        marginBottom: '32px'
      }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Explore Events</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
            Showing {totalCount} verified events with real-time seat availability
          </p>
        </div>

        {(user?.role === 'organizer' || user?.role === 'admin') && (
          <Link to="/events/create" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PlusCircle size={18} /> Host New Event
          </Link>
        )}
      </div>

      {/* Filter and Search Bar Card */}
      <div className="card" style={{ marginBottom: '32px', padding: '20px 24px' }}>
        
        {/* Search Input and Sort selector */}
        <form onSubmit={handleSearchSubmit} style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto auto',
          gap: '12px',
          marginBottom: '20px'
        }}>
          <div style={{ position: 'relative' }}>
            <input 
              type="text"
              className="form-input"
              placeholder="Search by title, location, or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '42px' }}
            />
            <Search 
              size={18} 
              style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} 
            />
          </div>

          <button type="submit" className="btn btn-secondary">
            Search
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ArrowUpDown size={16} color="var(--text-muted)" />
            <select 
              className="form-select"
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
              style={{ width: 'auto', minWidth: '160px' }}
            >
              <option value="eventDate:asc">Date: Upcoming First</option>
              <option value="eventDate:desc">Date: Latest First</option>
              <option value="price:asc">Price: Low to High</option>
              <option value="price:desc">Price: High to Low</option>
              <option value="capacity:desc">Capacity: Highest</option>
            </select>
          </div>
        </form>

        {/* Category Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-muted)', marginRight: '4px' }}>
            Category:
          </span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              style={{
                background: selectedCategory === cat ? 'var(--accent-gradient)' : 'rgba(255, 255, 255, 0.05)',
                color: selectedCategory === cat ? '#ffffff' : 'var(--text-secondary)',
                border: selectedCategory === cat ? 'none' : '1px solid var(--border-subtle)',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {cat}
            </button>
          ))}
          {(searchTerm || selectedCategory !== 'All') && (
            <button 
              onClick={handleClearFilters}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#f87171',
                fontSize: '0.82rem',
                cursor: 'pointer',
                marginLeft: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <RefreshCw size={12} /> Reset
            </button>
          )}
        </div>

      </div>

      {/* Events Grid */}
      {loading ? (
        <Loading message="Filtering events..." />
      ) : events.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <h3 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>No events matched your search criteria</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
            Try adjusting your keyword, resetting filters, or explore different categories.
          </p>
          <button onClick={handleClearFilters} className="btn btn-outline btn-sm">
            Clear All Filters
          </button>
        </div>
      ) : (
        <>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '24px',
            marginBottom: '40px'
          }}>
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px' }}>
              <button 
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn btn-secondary btn-sm"
              >
                Previous
              </button>

              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                Page {page} of {totalPages}
              </span>

              <button 
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="btn btn-secondary btn-sm"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

    </div>
  );
};

export default Events;
