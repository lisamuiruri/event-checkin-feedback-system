from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from models import Feedback, Event, User

feedback_bp = Blueprint('feedback', __name__)

@feedback_bp.route('/events/<int:event_id>/feedback', methods=['POST'])
@jwt_required()
def submit_feedback(event_id):
    current_user = get_jwt_identity()
    if current_user['role'] != 'employee':
        return jsonify({'message': 'Employee access required'}), 403
    
    # Check if event exists
    event = Event.query.get_or_404(event_id)
    
    # Check if user already submitted feedback for this event
    existing = Feedback.query.filter_by(
        user_id=current_user['id'], 
        event_id=event_id
    ).first()
    if existing:
        return jsonify({'message': 'Feedback already submitted for this event'}), 400
    
    data = request.get_json()
    feedback = Feedback(
        user_id=current_user['id'],
        event_id=event_id,
        rating=data['rating'],
        comment=data.get('comment', '')
    )
    
    db.session.add(feedback)
    db.session.commit()
    
    return jsonify({'message': 'Feedback submitted successfully'}), 201

@feedback_bp.route('/feedback', methods=['GET'])
@jwt_required()
def get_all_feedback():
    current_user = get_jwt_identity()
    if current_user['role'] != 'admin':
        return jsonify({'message': 'Admin access required'}), 403
    
    feedback_list = db.session.query(Feedback, User, Event).join(
        User, Feedback.user_id == User.id
    ).join(
        Event, Feedback.event_id == Event.id
    ).all()
    
    return jsonify([{
        'id': feedback.id,
        'rating': feedback.rating,
        'comment': feedback.comment,
        'created_at': feedback.created_at.isoformat(),
        'user_name': user.name,
        'event_title': event.title
    } for feedback, user, event in feedback_list])