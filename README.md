# Event Check-In and Feedback System

A lightweight internal tool for organizing training events with employee check-in and feedback functionality.

## Features

### User Roles
  **Admin**: Add/delete events, view feedback submissions
  **Employee**: View events, register for events, submit feedback

### Backend (Flask)
  JWT Authentication
  User management with role-based access
  Event management
  Feedback system with ratings and comments
  SQLite database
  CORS enabled for React frontend

### Frontend (React)
  Login/Register page
  Events listing page - Feedback submission page  
  Admin dashboard
  Role-based navigation
  JWT token storage in localStorage

## Setup Instructions

### Backend Setup
1. Navigate to server directory:
   ```bash
   cd server
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Run the Flask server:
   ```bash
   python app.py
   ```
   Server will run on http://localhost:5000

### Frontend Setup
1. Navigate to client directory:
   ```bash
   cd client
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm start
   ```
   Frontend will run on http://localhost:3000

## Default Admin Credentials
  **Email**: admin@company.com
  **Password**: admin123

## API Routes

### Authentication
  `POST /auth/register` - Create new user (Public)
  `POST /auth/login` - Login and return JWT (Public)

### Events
  `GET /events` - List all events (All users)
  `POST /events` - Create event (Admin only)
  `DELETE /events/<id>` - Delete event (Admin only)

### Feedback
  `POST /events/<id>/feedback` - Submit feedback (Employee only)
  `GET /feedback` - View all feedback (Admin only)

## Usage

1. Start both backend and frontend servers
2. Open http://localhost:3000 in your browser
3. Register a new account or login with admin credentials
4. Navigate between pages based on your role:
    m**Employees**: View events and submit feedback
     **Admins**: Manage events and view feedback

## Technology Stack

**Backend:**
  Flask
  Flask-SQLAlchemy
  Flask-JWT-Extended
  Flask-CORS
  SQLite

**Frontend:**
  React
  Axios
  localStorage for JWT storage