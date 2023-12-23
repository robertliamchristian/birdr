

from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash  # Import check_password_hash here
from flask_login import login_user, current_user, LoginManager, UserMixin, logout_user, login_required
from sqlalchemy.sql.expression import case
from sqlalchemy.orm.exc import NoResultFound
import datetime
import logging
from flask_cors import CORS
from sqlalchemy import distinct, case, func, and_
from flask import send_from_directory
from datetime import timedelta




app = Flask(__name__)
CORS(app, supports_credentials=True)
app.config['SESSION_COOKIE_SAMESITE'] = 'None'
app.config['SESSION_COOKIE_SECURE'] = True  # Should be used in combination with 'None' to ensure cookies are sent over HTTPS
app.permanent_session_lifetime = timedelta(days=1)

logging.basicConfig(level=logging.INFO)

app = Flask(__name__)
CORS(app, supports_credentials=True) 
login_manager = LoginManager()
login_manager.init_app(app)


app.secret_key = 'your secret key'

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

class ColorDim(db.Model):
    __tablename__ = 'color_dim'
    color_id = db.Column(db.Integer, primary_key=True)
    color = db.Column(db.String(255), nullable=False)

class ColorJunction(db.Model):
    __tablename__ = 'color_junction'
    color_bird_assoc_id = db.Column(db.Integer, primary_key=True)
    birdref = db.Column(db.Integer, db.ForeignKey('log.birdid'))
    color_ref = db.Column(db.Integer, db.ForeignKey('color_dim.color_id'))

class RegionDim(db.Model):
    __tablename__ = 'region_dim'
    id = db.Column(db.Integer, primary_key=True)
    region = db.Column(db.String(50), nullable=False)

class RegionJunction(db.Model):
    __tablename__ = 'region_junction'
    region_association_id = db.Column(db.Integer, primary_key=True)
    bird_ref = db.Column(db.Integer, db.ForeignKey('log.birdid'))
    region_ref = db.Column(db.Integer, db.ForeignKey('id.id'))

class UserList(db.Model):
    __tablename__ = 'user_list'
    listid = db.Column(db.Integer, primary_key=True)
    userid = db.Column(db.Integer, db.ForeignKey('alluser.id'))
    title = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False)

    def to_dict(self):
        return {
            'listid': self.listid,
            'userid': self.userid,
            'title': self.title,
            'created_at': self.created_at
        }

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
    list_id = data.get('listid')  # Extract listid from the request
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
        sighting_time=datetime.datetime.now(),
        listid=list_id  # Assign the list ID from the request
    )
    db.session.add(sighting)
    db.session.commit()

    return jsonify(sighting.to_dict()), 201


# start suggestion logic
from sqlalchemy import func, distinct, case

@app.route('/api/birdsuggestions', methods=['GET'])
def get_bird_suggestions():
    query = request.args.get('query', '')
    colors = request.args.getlist('color')
    regions = request.args.getlist('region')

    subquery = db.session.query(Log.bird, Log.birdid).\
        outerjoin(ColorJunction, Log.birdid == ColorJunction.birdref).\
        outerjoin(ColorDim, ColorJunction.color_ref == ColorDim.color_id).\
        outerjoin(RegionJunction, Log.birdid == RegionJunction.bird_ref).\
        outerjoin(RegionDim, RegionJunction.region_ref == RegionDim.id).\
        filter(Log.bird.ilike(f'%{query}%')).\
        subquery()

    birds = db.session.query(distinct(subquery.c.bird))

    if colors:
        birds = birds.group_by(subquery.c.birdid, subquery.c.bird).\
            having(func.count(distinct(case({ColorDim.color.in_(colors): ColorDim.color}, else_=None))) >= 1)

    if regions:
        birds = birds.group_by(subquery.c.birdid, subquery.c.bird).\
            having(func.count(distinct(case({RegionDim.region.in_(regions): RegionDim.region}, else_=None))) >= 1)

    birds = birds.limit(10).all()  # Limit to top 10 results

    return jsonify([bird[0] for bird in birds])


@app.route('/api/colors', methods=['GET'])
#@login_required
def get_colors():
    # Query all distinct colors
    colors = db.session.query(ColorDim.color).distinct().all()  
    # Convert list of tuples to list of strings
    colors = [color[0] for color in colors]
    return jsonify(colors)

@app.route('/api/regions', methods=['GET'])
#@login_required
def get_regions():
    # Query all distinct regions
    regions = db.session.query(RegionDim.region).distinct().all()
    # Convert list of tuples to list of strings
    regions = [region[0] for region in regions]
    return jsonify(regions)





#start list logic


@app.route('/api/userlist', methods=['GET', 'POST'])
@login_required
def userlist():
    if request.method == 'POST':
        data = request.json
        list_name = data.get('list_name')
        if list_name:
            new_list = UserList(userid=current_user.id, title=list_name, created_at=data.get('created_at'))
            db.session.add(new_list)
            db.session.commit()
            return jsonify({'status': 'success', 'message': 'List created', 'listid': new_list.listid})

        listid = request.form.get('listid')
        bird_name = request.form.get('bird')
        if listid and bird_name:
            new_bird = Log.query.filter_by(bird=bird_name).first()
            if new_bird:
                new_sighting = UserSighting(
                    birdref=new_bird.birdid,
                    userid=current_user.id,
                    sighting_time=datetime.now(),
                    listid=listid
                )
                db.session.add(new_sighting)
                db.session.commit()
                return jsonify({'status': 'success', 'message': 'Bird added to list', 'sightingid': new_sighting.sightingid})

    lists = UserList.query.filter_by(userid=current_user.id).all()
    return jsonify({'lists': [list.to_dict() for list in lists]})

@app.route('/api/user_sighting', methods=['GET'])
@login_required
def user_sighting():
    listid = request.args.get('listid')
    if listid:
        # Join UserSighting, Log, and UserList tables and filter by listid and userid
        sightings = db.session.query(Log.bird).\
            join(UserSighting, UserSighting.birdref == Log.birdid).\
            join(UserList, UserList.listid == UserSighting.listid).\
            filter(and_(UserList.listid == listid, UserSighting.userid == current_user.id)).all()
        birds = [sighting[0] for sighting in sightings]  # Get the bird names from the query results
        return jsonify({'birds': birds})
    else:
        return jsonify({'error': 'No listid provided'}), 400



@app.route('/api/delete_sighting/<int:sightingid>', methods=['POST'])
@login_required
def delete_sighting(sightingid):
    sighting = UserSighting.query.get_or_404(sightingid)
    if sighting.userid != current_user.id:
        # Prevent users from deleting sightings that do not belong to them
        return jsonify({'status': 'error', 'message': 'Unauthorized access'})
    
    db.session.delete(sighting)
    db.session.commit()

    return jsonify({'status': 'success', 'message': 'Sighting deleted successfully'})

from flask import jsonify

@app.route('/api/delete_list/<int:listid>', methods=['POST'])
@login_required
def delete_list(listid):
    list_to_delete = UserList.query.get_or_404(listid)
    if list_to_delete.userid != current_user.id:
        # Prevent users from deleting lists that do not belong to them
        return jsonify({'status': 'error', 'message': 'Unauthorized access'})

    # Delete all associated sightings if not using cascading deletes
    UserSighting.query.filter_by(listid=listid).delete()

    # Now delete the list itself
    db.session.delete(list_to_delete)
    db.session.commit()

    return jsonify({'status': 'success', 'message': 'List and associated sightings deleted successfully'})

from flask import send_from_directory

@app.route('/')
def home():
    return send_from_directory('static', 'index.html')


if __name__ == '__main__':
    with app.app_context():
        db.create_all()  
    app.run(debug=True, port=5002)




