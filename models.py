from app import db
import datetime

class Schedule(db.Model):
        __tablename__= 'schedules'

        id = db.Column(db.Integer, primary_key=True)
        start_time = db.Column(db.DateTime())
        end_time = db.Column(db.DateTime())
        #owner = db.Column(db.String(), db.ForeignKey('users.username'))
        owner = db.Column(db.String())

        def serialize(self):
                return{
                        'id': self.id,
                        'start_time': self.start_time,
                        'end_time': self.end_time,
                        'owner': self.owner,
                }
        def __repr__(self):
                return 'Schedule'+str(self.serialize())


class User(db.Model):
        __tablename__ = 'users'
       
        id = db.Column(db.Integer, primary_key=True)
        username = db.Column(db.String())
        password = db.Column(db.String())

        def serialize(self):
                return{
                        'id': self.id,
                        'username': self.username,
                        'password': self.password,
                }

        def __repr__(self):
                return 'user'+str(self.serialize())

