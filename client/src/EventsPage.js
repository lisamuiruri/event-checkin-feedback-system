import React, { useState, useEffect } from 'react';
import axios from 'axios';

function EventsPage({ user }) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/events');
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const registerForEvent = (eventId) => {
    alert(`Registered for event ${eventId}!`);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Upcoming Events</h2>
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