import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Calendar, PlusCircle, ArrowLeft, Tag, Clock, MapPin, DollarSign, Users } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const CreateEvent = () => {
  const navigate = useNavigate();
  const { user, showToast } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Tech',
    eventDate: '',
    eventTime: '10:00 AM',
    location: '',
    capacity: 100,
    price: 0,
    tags: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title || formData.title.length < 3) {
      setError('Title must be at least 3 characters.');
      return;
    }
    if (!formData.description || formData.description.length < 5) {
      setError('Description must be at least 5 characters.');
      return;
    }
    if (!formData.eventDate) {
      setError('Please select a valid date.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        capacity: Number(formData.capacity),
        price: Number(formData.price),
        tags: formData.tags ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean) : []
      };

      const res = await api.events.create(payload);
      if (res.success && res.data) {
        showToast('Event published successfully!', 'success');
        navigate(`/events/${res.data._id}`);
      }
    } catch (err) {
      setError(err.message || 'Failed to publish event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container animate-fade" style={{ padding: '40px 24px 80px 24px', maxWidth: '780px' }}>
      
      <Link to="/events" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.9rem' }}>
        <ArrowLeft size={16} /> Back to Events
      </Link>

      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Publish New Event</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
          Fill in event details, venue or online link, and seat capacity.
        </p>
      </div>

      <div className="card" style={{ padding: '36px' }}>
        
        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#f87171',
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.88rem',
            marginBottom: '24px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label className="form-label">Event Title</label>
            <input 
              type="text"
              name="title"
              required
              className="form-input"
              placeholder="e.g. Next-Gen Cloud & AI Summit 2026"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select 
                name="category"
                className="form-select"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="Tech">Tech</option>
                <option value="Workshop">Workshop</option>
                <option value="Seminar">Seminar</option>
                <option value="Conference">Conference</option>
                <option value="Networking">Networking</option>
                <option value="Concert">Concert</option>
                <option value="Webinar">Webinar</option>
                <option value="Festival">Festival</option>
                <option value="Sports">Sports</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Event Date</label>
              <input 
                type="date"
                name="eventDate"
                required
                className="form-input"
                value={formData.eventDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Event Time</label>
              <input 
                type="text"
                name="eventTime"
                required
                className="form-input"
                placeholder="09:30 AM"
                value={formData.eventTime}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Venue or Virtual Link</label>
              <input 
                type="text"
                name="location"
                required
                className="form-input"
                placeholder="Convention Center Hall A / Zoom"
                value={formData.location}
                onChange={handleChange}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Total Seat Capacity</label>
              <input 
                type="number"
                name="capacity"
                min="1"
                required
                className="form-input"
                value={formData.capacity}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Ticket Price ($ USD, 0 for Free)</label>
              <input 
                type="number"
                name="price"
                min="0"
                step="0.01"
                className="form-input"
                value={formData.price}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea 
              name="description"
              required
              className="form-textarea"
              placeholder="Provide a comprehensive summary of keynotes, topics, and expectations..."
              value={formData.description}
              onChange={handleChange}
              style={{ minHeight: '120px' }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '32px' }}>
            <label className="form-label">Tags (Comma-separated)</label>
            <input 
              type="text"
              name="tags"
              className="form-input"
              placeholder="AI, Software, Cloud, DevOps"
              value={formData.tags}
              onChange={handleChange}
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-lg" 
            style={{ width: '100%' }}
            disabled={loading}
          >
            <PlusCircle size={20} /> {loading ? 'Publishing Event...' : 'Publish Event'}
          </button>

        </form>

      </div>

    </div>
  );
};

export default CreateEvent;
