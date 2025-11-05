import React, { useState, useEffect } from 'react';
import axios from 'axios';

function EventsPage({ user }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/events');
      setEvents(response.data);
      setError('');
    } catch (error) {
      setError('Failed to load events');
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const registerForEvent = (eventId) => {
    alert(`Registered for event ${eventId}!`);
  };

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading events...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Upcoming Events</h2>
      {error && (
        <div style={{ color: 'red', padding: '10px', marginBottom: '10px', border: '1px solid red', borderRadius: '4px' }}>
          {error}
        </div>
      )}
      {events.length === 0 ? (
        <p>No events available.</p>
      ) : (
        events.map((event) => (
          <div key={event.id} style={{ 
            border: '1px solid #ccc', 
            margin: '10px 0', 
            padding: '15px', 
            borderRadius: '5px',
            backgroundColor: '#f9f9f9'
          }}>
            <h3>{event.title}</h3>
            <p><strong>Venue:</strong> {event.venue}</p>
            <button 
              onClick={() => registerForEvent(event.id)}
              style={{ padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
            >
              Register
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default EventsPage;