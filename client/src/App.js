import React, { useState, useEffect } from 'react';
import Login from './Login';
import EventsPage from './EventsPage';
import FeedbackPage from './FeedbackPage';
import AdminPage from './AdminPage';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('events');

  // Check if user is logged in on app start
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
      setIsLoggedIn(true);
      // Redirect based on role
      const userRole = JSON.parse(userData).role;
      setCurrentPage(userRole === 'admin' ? 'admin' : 'events');
    }
  }, []);



  const handleLogin = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    // Redirect based on role
    setCurrentPage(userData.role === 'admin' ? 'admin' : 'events');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsLoggedIn(false);
    setCurrentPage('events');
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'events':
        return <EventsPage user={user} />;
      case 'feedback':
        return <FeedbackPage user={user} />;
      case 'admin':
        return <AdminPage user={user} />;
      default:
        return <EventsPage user={user} />;
    }
  };

  return (
    <div className="App">
      {/* Navigation Header */}
      <header style={{ backgroundColor: '#282c34', padding: '10px 20px', color: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>Event Check-in System</h1>
          <div>
            <span>Welcome, {user?.name}!</span>
            <button onClick={handleLogout} style={{ marginLeft: '10px', padding: '5px 10px' }}>
              Logout
            </button>
          </div>
        </div>
        
        {/* Navigation Menu */}
        <nav style={{ marginTop: '10px' }}>
          {user?.role === 'admin' ? (
            <button 
              onClick={() => setCurrentPage('admin')}
              style={{ 
                padding: '8px 16px', 
                marginRight: '10px',
                backgroundColor: currentPage === 'admin' ? '#007bff' : 'transparent',
                color: 'white',
                border: '1px solid white'
              }}
            >
              Admin Dashboard
            </button>
          ) : (
            <>
              <button 
                onClick={() => setCurrentPage('events')}
                style={{ 
                  padding: '8px 16px', 
                  marginRight: '10px',
                  backgroundColor: currentPage === 'events' ? '#007bff' : 'transparent',
                  color: 'white',
                  border: '1px solid white'
                }}
              >
                Events
              </button>
              <button 
                onClick={() => setCurrentPage('feedback')}
                style={{ 
                  padding: '8px 16px',
                  backgroundColor: currentPage === 'feedback' ? '#007bff' : 'transparent',
                  color: 'white',
                  border: '1px solid white'
                }}
              >
                Feedback
              </button>
            </>
          )}
        </nav>
      </header>
      
      {/* Page Content */}
      <main>
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
