from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash
from flask_login import login_user, current_user, LoginManager

app = Flask(__name__)
CORS(app)  # This will allow cross-origin requests from your React app
login_manager = LoginManager()
login_manager.init_app(app)

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
    


@app.route('/api/birds', methods=['GET'])
def get_birds():
    birds = Log.query.all()  # Removed with_entities to get full Log instances
    return jsonify([bird.to_dict() for bird in birds])



if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # This will now be called inside an application context
    app.run(debug=True, port=5002)


