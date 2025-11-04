import React, { useState, useEffect } from 'react';
import axios from 'axios';

function FeedbackPage({ user }) {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

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

  const submitFeedback = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/events/${selectedEvent}/feedback`, {
        rating: parseInt(rating),
        comment
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert('Feedback submitted successfully!');
      setSelectedEvent('');
      setRating(5);
      setComment('');
    } catch (error) {
      alert(error.response?.data?.message || 'Error submitting feedback');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px' }}>
      <h2>Submit Feedback</h2>
      <form onSubmit={submitFeedback}>
        <div style={{ marginBottom: '15px' }}>
          <label>Select Event:</label>
          <select 
            value={selectedEvent} 
            onChange={(e) => setSelectedEvent(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', margin: '5px 0' }}
          >
            <option value="">Choose an event...</option>
            {events.map(event => (
              <option key={event.id} value={event.id}>
                {event.title} - {event.venue}
              </option>
            ))}
          </select>
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label>Rating (1-5):</label>
          <select 
            value={rating} 
            onChange={(e) => setRating(e.target.value)}
            style={{ width: '100%', padding: '8px', margin: '5px 0' }}
          >
            <option value={1}>1 - Poor</option>
            <option value={2}>2 - Fair</option>
            <option value={3}>3 - Good</option>
            <option value={4}>4 - Very Good</option>
            <option value={5}>5 - Excellent</option>
          </select>
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label>Comment:</label>
          <textarea 
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your feedback..."
            style={{ width: '100%', padding: '8px', margin: '5px 0', height: '100px' }}
          />
        </div>
        
        <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}>
          Submit Feedback
        </button>
      </form>
    </div>
  );
}

export default FeedbackPage;