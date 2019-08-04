from flask import abort, Flask, json, redirect, render_template, request, Response, url_for, session, jsonify
from werkzeug.utils import secure_filename
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta
from json import dumps
import os

app = Flask(__name__)
app.config.from_object(os.environ['APP_SETTINGS'])
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.secret_key = app.config['SECRET_KEY']
db = SQLAlchemy(app)

from models import User, Schedule

@app.route('/')
def index():
    return render_template('index.html')

def validate(d, keys):
    for k in keys:
        if k not in d:
            raise Exception('{} does not contain key "{}"'.format(d, k))

#This will populate our schedule in our react app
@app.route('/api/fetch-schedule/', methods = ['GET'])
def api_fetch_schedule():
    listings = list(map(lambda p: p.serialize(), Schedule.query.order_by(Schedule.id.desc()).all()))
    jlistings = jsonify(listings)
    return jlistings

#This will delete a scheduled time only if it is yours 
@app.route('/api/delete/', methods=['POST'])
def api_delete():
    data = request.form["id"]
    schedule_time=Schedule.query.filter(Schedule.owner==session['username']).filter(Schedule.id==data).first()
    if(schedule_time!=None):
       db.session.delete(schedule_time)
       db.session.commit()
       return 'ok'

    else:
       return 'fail'

#This will register your time into the schedule.
@app.route('/api/reg-schedule/', methods=['POST'])
def api_regSchedule():
    startDate = request.form['date'] + " " + request.form['start-time']
    endDate = request.form['date'] + " " + request.form['end-time']

    startDate = datetime.strptime(startDate, "%Y-%m-%d %H:%M")
    endDate = datetime.strptime(endDate, "%Y-%m-%d %H:%M")
    delta = endDate - startDate 

    endTime = Schedule.query.filter_by( end_time = endDate).first()
    startTime = Schedule.query.filter_by(start_time = startDate).first()
    
    if startDate == endDate:
        return 'fail'

    if delta > timedelta(hours=8):
        return 'toolong'
    #make sure times aren't overlapping
    for date in Schedule.query.all():
        print(date)
        print(startDate.date())
        print(date.start_time.date())
        if date.start_time.date() == startDate.date():
            print("from the table")
            print(date.start_time.date())
            print("from the form")
            print(startDate.date())
            if(endDate <= date.start_time or startDate >= date.end_time):
                newRev = Schedule(start_time=startDate, end_time=endDate, owner = session['username'])
                db.session.add(newRev)
                db.session.commit()
                return 'ok'
            else:
                return'alreadybooked'
    newRev = Schedule(start_time=startDate, end_time=endDate, owner = session['username'])
    db.session.add(newRev)
    db.session.commit()
    return 'ok'
         
#taking us to our schedule page
@app.route('/api/schedule/', methods=['POST'])
def api_schedule():
    try:
        validate(session, ['username'])
        return 'ok'

    except Exception as e: 
        return 'Not authenticated', 403
#checks if you can log in or not
@app.route('/api/login/', methods=['POST'])
def api_login():
    user = User.query.filter_by(username = request.form['username']).first()
    try:
        if request.form['username'] == user.username and request.form['password'] == user.password:
            session['username'] = request.form['username']
            session['id'] = user.id
            return 'ok'
        else:
            return 'fail'

    except:
       return 'fail'

@app.route('/api/logout/', methods=['POST'])
def api_logout():
    try:
        del session['username']
        return 'ok'
    except:
       return 'fail'
#registers you into the database if your credentials aren't the same as anyone elses
@app.route('/api/register/', methods=['POST'])
def api_register():
    username = request.form['reg-username'].strip().lower()
    aaron=User.query.filter_by(username = request.form['reg-username']).first()
    if aaron != None:
        return 'fail'
    else:
        password = request.form['reg-pass'].strip()
        newUser = User(username=username, password=request.form['reg-pass'])
        db.session.add(newUser)
        db.session.commit()
        session['username'] = request.form['reg-username']
        return 'ok'

if __name__ == '__main__':
    app.run()
