import React from 'react';
import ReactDOM from 'react-dom';

class Schedule extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            scheduled_dates: [],
            isLoaded: false,
            error: null
        };
    }

    componentDidMount() {
        console.log('----------------- MOUNTED ---------------');
        window.fetch('/api/fetch-schedule/')
            .then(res => res.json())
            .then(
                (result) => {
                    console.log('----------- Dates will be ' + result);
                    this.setState({
                        isLoaded: true,
                        scheduled_dates: result
                    });
         
                },
                (error) => {
                    alert('error');
                    console.log('------ ERROR! -------');
                    this.setState({
                        isLoaded: true,
                        error: error
                    });
                }
            );
    }

    loadSchedule() {
        console.log('----------------- MOUNTED ---------------');
        window.fetch('/api/fetch-schedule/')
            .then(res => res.json())
            .then(
                (result) => {
                    console.log('----------- Dates will be ' + result);
                    this.setState({
                        isLoaded: true,
                        scheduled_dates: result
                    });
         
                },
                (error) => {
                    alert('error');
                    console.log('------ ERROR! -------');
                    this.setState({
                        isLoaded: true,
                        error: error
                    });
                }
            );
    }
    
    timeRegisterRoute(){
        var formData = new FormData(document.querySelector('#time-form'));
        window.fetch('/api/reg-schedule/',{
            method:'POST',
            body: formData
            })
            .then(result => result.text())
            .then(
                (result) => {
                    if (result === 'ok') {
                        alert('Time Registerd.');
                        this.loadSchedule(); 
                    } else if(result === 'toolong') {
                        alert('The studio cannot be booked longer than 8 hours.');
                    }
                     else if(result === 'alreadybooked'){
                        alert('The studio is already booked during these times.' );
                    }
                      else {
                        alert('Invalid timeframe.');
                    }
                },  
                (error) => {
                    alert('General login error.');
                },
            );
    }

    logoutRoute(){
   
        window.fetch('/api/logout/',{
             method: 'POST'
             })
            .then(result => result.text())
            .then(
                (result) => {
                    if (result === 'ok') {
                        this.props.onLogout();
                    } else {
                        alert('u aint goin no where');
                    }
                },
                (error) => {
                    alert('General login error.');
                },
            );
    }
    deleteTime(post_time_id){
        var form = new FormData();
        form.append("id",post_time_id);
        window.fetch('/api/delete/',{
            method:'POST',
            body: form
            })
            .then(result => result.text())
            .then(
                (result) => {
                    console.log(result);
                    if (result === 'ok') {
                        alert('You deleted your scheduled time.');
                        this.loadSchedule(); 
                    } else {
                        alert('Please select your own scheduled time.');
                    }
                },
                (error) => {
                    alert('General login error.');
                },
            );
    }
    

    render() {
        return( 
            <div>
                <button id="logout-btn" onClick={(evt) => {
                    evt.preventDefault();
                    this.logoutRoute();
                    }}>Logout</button>
                  <form id="time-form">
                    Please Register A Time
                    <input
                        placeholder="3/3/2017"
                        type="date"
                        id="date"
                        name="date"/>
                    <br />
                    Start Time
                    <input
                        placeholder="start-time"
                        type="time"
                        id="start-time"
                        name="start-time"/>
                    <br />
                    End Time
                    <input
                        placeholder="end-time"
                        type="time"
                        id="end-time"
                        name="end-time"/>
                    <br />
                    <button
                        id="register-time-btn"
                        onClick={(evt) => {
                            evt.preventDefault();
                            this.timeRegisterRoute();
                        }}>Register Time</button>
                    </form>
                <div className='scheduled-times'>
                    Booked Times
                    <ul>
                    {this.state.scheduled_dates.map(a_date => (
                        <li key={a_date.id}>
                            {a_date.start_time} - {a_date.end_time} - {a_date.owner}
                            <button
                                id="delete-btn"
                                onClick={(evt) => {
                                evt.preventDefault();
                                this.deleteTime(a_date.id);
                            }}>Delete Time</button>
                        </li>
                    ))}
                    </ul>
                </div>
            </div>
            
        );
    }
}

class Login extends React.Component {

    sendLoginRequest() {
        var formData = new FormData(document.querySelector('#login-form'));
        window.fetch('/api/login/', {
            method: 'POST',
            body: formData,
        })
            .then(result => result.text())
            .then(
                (result) => {
                    console.log.result;
                    if (result === 'ok') {
                        this.props.onLogin();
                    } else {
                        alert('Bad username/password.');
                    }
                },
                (error) => {
                    alert('General login error.');
                },
            );
    }
    render() {
        return (
            <div id="bg-img">
                <form id="login-form">
                    BVU Recording Studio
                    <input
                        placeholder="username"
                        type="username"
                        id="username"
                        name="username"/>
                    <br />
                    <input
                        placeholder="password"
                        type="password"
                        id="password"
                        name="password"/>
                    <br />
                    <button
                        id="login-btn"
                        onClick={(evt) => {
                            evt.preventDefault();
                            this.sendLoginRequest();
                        }}>Login</button>
        <div> To register click here.</div>
        <button
                id="register-switch-btn"
                onClick={(evt) => {
                    evt.preventDefault();
                    this.props.switchToRegister();
                }}>Register</button>
                </form>
            </div>
        );
    }
}

class Register extends React.Component {

    sendRegisterRequest() {
        var formData = new FormData(document.querySelector('#register-form'));
        window.fetch('/api/register/', {
            method: 'POST',
            body: formData,
        })
            .then(result => result.text())
            .then(
                (result) => {
                    if (result === 'ok') {
                        this.props.onRegister();
                    } else {
                        alert('username/password exists ');
                    }
                },
                (error) => {
                    alert('General login error.');
                },
            );
    }
    
    render() {
        return (
            <div className="bg-img">
                <form id="register-form">
                    <div>Register Form</div>
                    <input
                        placeholder="username"
                        type="reg-username"
                        id="reg-username"
                        name="reg-username"/>
                    <br />
                    <input
                        placeholder="password"
                        type="reg-pass"
                        id="reg-pass"
                        name="reg-pass"/>
                    <br />
                    <button
                        id="register-btn"
                        onClick={(evt) => {
                            evt.preventDefault();
                            this.sendRegisterRequest();
                        }}>Register</button>
                </form>
            </div>
        );
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            view: 'login'
        };
    }

    switchToRegister() {
        this.setState({
            view: 'register-page'
        });
    }
    onLogin() {
        this.setState({
            view: 'schedule'
        });
    }

    onRegister() {
        this.setState({
            view: 'login'
        });
    }
    
    onLogout() {
        this.setState({
            view: 'login'
        });
    }

    render() {
        let component;
        if(this.state.view === 'login'){
            component=<Login switchToRegister={() => this.switchToRegister()} onLogin={() => 
            this.onLogin()} />; 
        } 

        if(this.state.view === 'register-page'){
            component=<Register onRegister={() => this.onRegister()}/>; 
        }
        if(this.state.view === 'schedule'){
            component=<Schedule onLogout={() => this.onLogout()}/>;
        }
        return (
            <div className="app">
              {component}
            </div>
        );
    }
}


ReactDOM.render(<App />, document.getElementById('content'));

