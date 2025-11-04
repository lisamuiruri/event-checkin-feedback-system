import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminPage({ user }) {
  const [events, setEvents] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [newEvent, setNewEvent] = useState({ title: '', date: '', venue: '' });
  const [activeTab, setActiveTab] = useState('events');

  useEffect(() => {
    fetchEvents();
    fetchFeedback();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/events');
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const fetchFeedback = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/feedback', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFeedback(response.data);
    } catch (error) {
      console.error('Error fetching feedback:', error);
    }
  };

  const createEvent = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/events', newEvent, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewEvent({ title: '', date: '', venue: '' });
      fetchEvents();
      alert('Event created successfully!');
    } catch (error) {
      alert('Error creating event');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Admin Dashboard</h2>
      
      {/* Tab Navigation */}
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => setActiveTab('events')}
          style={{ 
            padding: '10px 20px', 
            marginRight: '10px',
            backgroundColor: activeTab === 'events' ? '#007bff' : '#f8f9fa',
            color: activeTab === 'events' ? 'white' : 'black',
            border: '1px solid #ccc'
          }}
        >
          Manage Events
        </button>
        <button 
          onClick={() => setActiveTab('feedback')}
          style={{ 
            padding: '10px 20px',
            backgroundColor: activeTab === 'feedback' ? '#007bff' : '#f8f9fa',
            color: activeTab === 'feedback' ? 'white' : 'black',
            border: '1px solid #ccc'
          }}
        >
          View Feedback
        </button>
      </div>

      {/* Events Tab */}
      {activeTab === 'events' && (
        <div>
          <h3>Add New Event</h3>
          <form onSubmit={createEvent} style={{ marginBottom: '30px' }}>
            <input
              type="text"
              placeholder="Event Title"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              required
              style={{ width: '100%', padding: '10px', margin: '5px 0' }}
            />
            <input
              type="date"
              value={newEvent.date}
              onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
              required
              style={{ width: '100%', padding: '10px', margin: '5px 0' }}
            />
            <input
              type="text"
              placeholder="Venue"
              value={newEvent.venue}
              onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}
              required
              style={{ width: '100%', padding: '10px', margin: '5px 0' }}
            />
            <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none' }}>
              Create Event
            </button>
          </form>

          <h3>All Events</h3>
          {events.map((event) => (
            <div key={event.id} style={{ border: '1px solid #ccc', margin: '10px 0', padding: '15px' }}>
              <h4>{event.title}</h4>
              <p>Venue: {event.venue}</p>
            </div>
          ))}
        </div>
      )}

      {/* Feedback Tab */}
      {activeTab === 'feedback' && (
        <div>
          <h3>All Feedback</h3>
          {feedback.length === 0 ? (
            <p>No feedback submitted yet.</p>
          ) : (
            feedback.map((item) => (
              <div key={item.id} style={{ border: '1px solid #ccc', margin: '10px 0', padding: '15px' }}>
                <h4>{item.event_title}</h4>
                <p><strong>Rating:</strong> {item.rating}/5</p>
                <p><strong>Comment:</strong> {item.comment}</p>
                <p><strong>By:</strong> {item.user_name}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default AdminPage;