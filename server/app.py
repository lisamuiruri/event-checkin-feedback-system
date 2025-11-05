from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///events.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'secret'
app.config['JWT_SECRET_KEY'] = 'jwt-secret'

db = SQLAlchemy(app)
jwt = JWTManager(app)
CORS(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), default='employee')
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    venue = db.Column(db.String(200), nullable=False)
    date = db.Column(db.DateTime, nullable=True)

class Feedback(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    event_id = db.Column(db.Integer, db.ForeignKey('event.id'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    comment = db.Column(db.Text)

@app.route('/')
def home():
    return jsonify({'message': 'Event Check-in API is running!', 'endpoints': ['/events', '/auth/register', '/auth/login']})

@app.route('/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'Email exists'}), 400
    
    user = User(name=data['name'], email=data['email'], role=data.get('role', 'employee'))
    user.set_password(data['password'])
    db.session.add(user)
    db.session.commit()
    return jsonify({'message': 'User created'}), 201

@app.route('/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    
    if user and user.check_password(data['password']):
        token = create_access_token(identity={'id': user.id, 'role': user.role})
        return jsonify({'token': token, 'user': {'id': user.id, 'name': user.name, 'role': user.role}})
    
    return jsonify({'message': 'Invalid credentials'}), 401

@app.route('/events', methods=['GET'])
def get_events():
    events = Event.query.all()
    return jsonify([{'id': e.id, 'title': e.title, 'venue': e.venue} for e in events])

@app.route('/events', methods=['POST'])
@jwt_required()
def create_event():
    current_user = get_jwt_identity()
    if current_user['role'] != 'admin':
        return jsonify({'message': 'Admin required'}), 403
    
    try:
        data = request.get_json()
        from datetime import datetime
        
        date_obj = None
        if data.get('date'):
            date_obj = datetime.strptime(data['date'], '%Y-%m-%d')
        
        event = Event(title=data['title'], venue=data['venue'], date=date_obj)
        db.session.add(event)
        db.session.commit()
        return jsonify({'message': 'Event created'}), 201
    except Exception as e:
        return jsonify({'message': f'Error creating event: {str(e)}'}), 400

@app.route('/events/<int:event_id>', methods=['DELETE'])
@jwt_required()
def delete_event(event_id):
    current_user = get_jwt_identity()
    if current_user['role'] != 'admin':
        return jsonify({'message': 'Admin required'}), 403
    
    event = Event.query.get_or_404(event_id)
    db.session.delete(event)
    db.session.commit()
    return jsonify({'message': 'Event deleted'}), 200

@app.route('/events/<int:event_id>/feedback', methods=['POST'])
@jwt_required()
def submit_feedback(event_id):
    current_user = get_jwt_identity()
    if current_user['role'] != 'employee':
        return jsonify({'message': 'Employee required'}), 403
    
    if Feedback.query.filter_by(user_id=current_user['id'], event_id=event_id).first():
        return jsonify({'message': 'Already submitted'}), 400
    
    data = request.get_json()
    feedback = Feedback(user_id=current_user['id'], event_id=event_id, rating=data['rating'], comment=data.get('comment', ''))
    db.session.add(feedback)
    db.session.commit()
    return jsonify({'message': 'Feedback submitted'}), 201

@app.route('/feedback', methods=['GET'])
@jwt_required()
def get_all_feedback():
    current_user = get_jwt_identity()
    if current_user['role'] != 'admin':
        return jsonify({'message': 'Admin required'}), 403
    
    feedback_list = db.session.query(Feedback, User, Event).join(User).join(Event).all()
    return jsonify([{'id': f.id, 'rating': f.rating, 'comment': f.comment, 'user_name': u.name, 'event_title': e.title} for f, u, e in feedback_list])

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        # Create default admin user
        admin = User.query.filter_by(email='admin@company.com').first()
        if not admin:
            admin = User(name='Admin', email='admin@company.com', role='admin')
            admin.set_password('admin123')
            db.session.add(admin)
            db.session.commit()
            print('Admin created: admin@company.com / admin123')
    app.run(debug=True, host='localhost', port=5001)