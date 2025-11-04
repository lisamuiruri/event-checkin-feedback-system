from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from app import db
from models import Event

events_bp = Blueprint('events', __name__)

@events_bp.route('', methods=['GET'])
def get_events():
    events = Event.query.all()
    return jsonify([{
        'id': event.id,
        'title': event.title,
        'date': event.date.isoformat(),
        'venue': event.venue,
        'description': event.description
    } for event in events])

@events_bp.route('', methods=['POST'])
@jwt_required()
def create_event():
    current_user = get_jwt_identity()
    if current_user['role'] != 'admin':
        return jsonify({'message': 'Admin access required'}), 403
    
    data = request.get_json()
    event = Event(
        title=data['title'],
        date=datetime.fromisoformat(data['date']),
        venue=data['venue'],
        description=data.get('description', '')
    )
    
    db.session.add(event)
    db.session.commit()
    
    return jsonify({'message': 'Event created successfully'}), 201

@events_bp.route('/<int:event_id>', methods=['DELETE'])
@jwt_required()
def delete_event(event_id):
    current_user = get_jwt_identity()
    if current_user['role'] != 'admin':
        return jsonify({'message': 'Admin access required'}), 403
    
    event = Event.query.get_or_404(event_id)
    db.session.delete(event)
    db.session.commit()
    
    return jsonify({'message': 'Event deleted successfully'})