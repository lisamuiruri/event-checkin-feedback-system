from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///events.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
CORS(app)

class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    venue = db.Column(db.String(200), nullable=False)

@app.route('/')
def home():
    return jsonify({'message': 'Event Check-in API is running!', 'endpoints': ['/events']})

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
    app.run(debug=True)