from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Simple test endpoints
@app.route('/')
def home():
    return jsonify({'message': 'Server working!'})

@app.route('/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    if data['email'] == 'admin@company.com' and data['password'] == 'admin123':
        return jsonify({
            'token': 'test-token',
            'user': {'id': 1, 'name': 'Admin', 'email': 'admin@company.com', 'role': 'admin'}
        })
    return jsonify({'message': 'Invalid credentials'}), 401

@app.route('/events', methods=['GET'])
def get_events():
    return jsonify([{'id': 1, 'title': 'Test Event', 'venue': 'Test Venue'}])

if __name__ == '__main__':
    app.run(debug=True, host='localhost', port=5000)