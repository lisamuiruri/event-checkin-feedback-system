import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ title: '', venue: '' });

  // Fetch events from Flask backend
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

  const createEvent = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/events', newEvent);
      setNewEvent({ title: '', venue: '' });
      fetchEvents(); // Refresh the list
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Event Check-in System</h1>
        
        {/* Create Event Form */}
        <form onSubmit={createEvent} style={{ margin: '20px' }}>
          <input
            type="text"
            placeholder="Event Title"
            value={newEvent.title}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
            required
            style={{ margin: '5px', padding: '10px' }}
          />
          <input
            type="text"
            placeholder="Venue"
            value={newEvent.venue}
            onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}
            required
            style={{ margin: '5px', padding: '10px' }}
          />
          <button type="submit" style={{ margin: '5px', padding: '10px' }}>
            Create Event
          </button>
        </form>

        {/* Events List */}
        <div>
          <h2>Upcoming Events</h2>
          {events.length === 0 ? (
            <p>No events found. Create one above!</p>
          ) : (
            events.map((event) => (
              <div key={event.id} style={{ 
                border: '1px solid #ccc', 
                margin: '10px', 
                padding: '15px', 
                borderRadius: '5px',
                backgroundColor: '#f9f9f9',
                color: '#333'
              }}>
                <h3>{event.title}</h3>
                <p>Venue: {event.venue}</p>
              </div>
            ))
          )}
        </div>
      </header>
    </div>
  );
}

export default App;
