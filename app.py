

from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash  # Import check_password_hash here
from flask_login import login_user, current_user, LoginManager, UserMixin, logout_user, login_required
from sqlalchemy.sql.expression import case
from sqlalchemy.orm.exc import NoResultFound
import datetime

app = Flask(__name__)
CORS(app, supports_credentials=True) 
login_manager = LoginManager()
login_manager.init_app(app)


app.secret_key = 'your_really_secret_key_here'

# Configure your database connection here
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://wpuhuargucydbt:e8f85ea517fa5809ce3693691455d866fb90936294eea12d9479c6a262419477@ec2-3-234-126-10.compute-1.amazonaws.com:5432/d73l1lvoh2a6o'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class Log(db.Model):
    __tablename__ = 'log'
    birdid = db.Column(db.Integer, primary_key=True)
    region = db.Column(db.String(100), nullable=False)
    family = db.Column(db.String(300), nullable=False)
    bird = db.Column(db.String(200), nullable=False)
    latin = db.Column(db.String(255), nullable=False)
    flags = db.Column(db.String(255), nullable=False)
    bird_type = db.Column(db.String(255), nullable=False)
    t_order = db.Column(db.String(200), nullable=False)
    family_rank = db.Column(db.Integer, nullable=False)

    def to_dict(self):
        return {'birdid': self.birdid, 'bird': self.bird}
    
    def to_dict(self):
        return {
            'birdid': self.birdid,
            'bird': self.bird,
            # Include other fields if needed
        }
    
class UserSighting(db.Model):
    __tablename__ = 'user_sighting'
    sightingid = db.Column(db.Integer, primary_key=True)
    birdref = db.Column(db.Integer, db.ForeignKey('log.birdid'))
    userid = db.Column(db.Integer, db.ForeignKey('alluser.id'))
    sighting_time = db.Column(db.DateTime, nullable=False)
    listid = db.Column(db.Integer, db.ForeignKey('user_list.listid'))
    
    def to_dict(self):
        return {'sightingid': self.sightingid, 'birdref': self.birdref, 'userid': self.userid, 'sighting_time': self.sighting_time, 'listid': self.listid}
    
class UserList(db.Model):
    __tablename__ = 'user_list'
    listid = db.Column(db.Integer, primary_key=True)
    userid = db.Column(db.Integer, db.ForeignKey('alluser.id'))
    title = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False)

@app.route('/api/birds', methods=['GET'])
@login_required
def get_birds():
    user_id = current_user.get_id()  # Use get_id() method which handles AnonymousUserMixin
    birds = db.session.query(
        Log,
        case((UserSighting.sighting_time != None, "Sighted"), else_="Not Sighted").label("seen")
    ).outerjoin(
        UserSighting, db.and_(Log.birdid == UserSighting.birdref, UserSighting.userid == user_id)
    ).all()

    return jsonify([{
        **bird.to_dict(),
        'seen': seen
    } for bird, seen in birds])


#start user logic
class User(UserMixin, db.Model):
    __tablename__ = 'alluser'  
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    insert_date = db.Column(db.DateTime, nullable=False)
    email = db.Column(db.String(255), nullable=False)
    is_admin = db.Column(db.Boolean, nullable=False)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))
    
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()

    if user and user.check_password(data['password']):
        login_user(user)
        return jsonify({'status': 'success', 'message': 'Logged in successfully', 'username': user.username})
    else:
        return jsonify({'status': 'fail', 'message': 'Invalid username or password'}), 401


#add bird logic

@app.route('/api/sightings', methods=['POST'])
@login_required
def add_sighting():
    data = request.get_json()
    bird_name = data.get('birdname')
    user_id = current_user.get_id()

    # Look up the bird's ID in the log table
    try:
        bird = Log.query.filter_by(bird=bird_name).one()
    except NoResultFound:
        return jsonify({'error': 'Bird not found'}), 404

    # Create the new sighting
    sighting = UserSighting(
        birdref=bird.birdid,
        userid=user_id,
        sighting_time=datetime.datetime.now(),  # Use the current time
        listid=None  # Or use the list ID from the request
    )
    db.session.add(sighting)
    db.session.commit()

    return jsonify(sighting.to_dict()), 201

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  
    app.run(debug=True, port=5002)


