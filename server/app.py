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
def create_event():
    data = request.get_json()
    event = Event(title=data['title'], venue=data['venue'])
    db.session.add(event)
    db.session.commit()
    return jsonify({'message': 'Event created'}), 201

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
    app.run(debug=True)