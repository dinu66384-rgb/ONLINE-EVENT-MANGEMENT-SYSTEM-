import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, ArrowRight, Tag } from 'lucide-react';

const EventCard = ({ event }) => {
  const {
    _id,
    title,
    description,
    category,
    eventDate,
    eventTime,
    location,
    capacity = 100,
    registeredCount = 0,
    price = 0,
    status = 'upcoming'
  } = event;

  const availableSeats = Math.max(0, capacity - registeredCount);
  const occupancyRate = Math.min(100, Math.round((registeredCount / capacity) * 100));
  const isFull = availableSeats <= 0;

  const formattedDate = new Date(eventDate).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="card" style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: '100%',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div>
        {/* Top Badges */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <span className={`badge badge-${category.toLowerCase()}`}>
            <Tag size={12} /> {category}
          </span>
          <span className={`badge badge-${status}`}>
            {status}
          </span>
        </div>

        {/* Title */}
        <h3 style={{
          fontSize: '1.25rem',
          fontWeight: 700,
          marginBottom: '10px',
          color: '#ffffff',
          lineHeight: 1.35
        }}>
          <Link to={`/events/${_id}`} style={{ color: 'inherit' }}>
            {title}
          </Link>
        </h3>

        {/* Description snippet */}
        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '0.88rem',
          lineHeight: 1.55,
          marginBottom: '20px',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {description}
        </p>

        {/* Metadata info items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px', fontSize: '0.86rem', color: '#cbd5e1' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={15} color="#818cf8" />
            <span>{formattedDate}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={15} color="#818cf8" />
            <span>{eventTime}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={15} color="#818cf8" />
            <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{location}</span>
          </div>
        </div>
      </div>

      <div>
        {/* Capacity / Availability Progress */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
            <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Users size={13} /> {registeredCount} / {capacity} Attendees
            </span>
            <span style={{ fontWeight: 600, color: isFull ? '#ef4444' : '#10b981' }}>
              {isFull ? 'Sold Out' : `${availableSeats} seats left`}
            </span>
          </div>
          <div className="progress-container">
            <div 
              className={`progress-bar ${occupancyRate > 85 ? 'progress-bar-warning' : ''}`}
              style={{ width: `${occupancyRate}%` }}
            />
          </div>
        </div>

        {/* Footer actions: Price & View/Book button */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '14px',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)'
        }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Ticket Price</span>
            <span style={{ fontSize: '1.15rem', fontWeight: 800, color: price > 0 ? '#ffffff' : '#10b981' }}>
              {price > 0 ? `$${Number(price).toFixed(2)}` : 'FREE'}
            </span>
          </div>

          <Link 
            to={`/events/${_id}`}
            className="btn btn-primary btn-sm"
          >
            <span>Details</span> <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
