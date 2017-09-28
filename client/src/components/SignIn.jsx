import React, { Component } from 'react';
import { firebaseApp } from '../firebase';
import { Link } from 'react-router-dom';
import '../styles/SignIn.css';

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      error: {
        message: ''
      }
    }
  }

  signIn() {
    console.log('this state', this.state);
    const { email, password } = this.state;
    firebaseApp.auth().signInWithEmailAndPassword(email, password)
      .catch(error => {
        this.setState({error});
      })
  }

  render() {

    return (
      <div className="page">
        <div className="title-block">Задачи RGK</div>
        <div className="main-block" style={{width: '55%'}}>
          <h2>Вход</h2>
          <div className="form-inline">
            <div className="form-group">
              <div className="group-login">
                <span>Логин:</span>
                <input
                  type="text"
                  style={{marginRight: '5px'}}
                  className="form-control"
                  placeholder="email"
                  onChange={event => this.setState({email: event.target.value})}
                />
              </div>
              <div className="group-login">
                <span>Пароль:</span>
                <input
                  type="password"
                  style={{marginRight: '5px'}}
                  className="form-control"
                  placeholder="password"
                  onChange={event => this.setState({password: event.target.value})}
                />
              </div>
              <div className="group-login">
                <div className="registration"><Link to={'/signup'}>Регистрация</Link></div>
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={() => this.signIn()}
                >
                  Вход
                </button>
              </div>
            </div>
          </div>
          <div className="login_erron">{this.state.error.message}</div>
        </div>
      </div>
    )
  }
}

export default SignIn;
