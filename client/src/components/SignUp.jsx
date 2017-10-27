import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { firebaseApp, userListRef } from '../firebase';

class SignUp extends Component {
  constructor(props) {
    super(props);
    // const id = Math.random().toString(36).substr(2, 9);
    this.state = {
      email: '',
      password: '',
      name: '',
      rights: 'Гость',
      avatar: 'unknown-user.svg',
      error: {
        message: ''
      }
    }
  }

  signUp() {
    console.log('this state', this.state);
    const { email, password, name, rights, avatar } = this.state;
    firebaseApp.auth().createUserWithEmailAndPassword(email, password)
      .catch(error => {
        this.setState({error});
      })
      .then(function() {
        userListRef.push({email, name, rights, avatar})
      });
  }

  render() {
    return (
      <div className="page-enterpage">
        <div className="title-block-enterpage">Задачи RGK</div>
        <div className="main-block-enterpage offset-1 col-10 offset-sm-2 col-sm-8 offset-md-3 col-md-6 offset-lg-4 col-lg-4">
        <h2>Регистрация</h2>
        <div className="form-inline login-block-enterpage">
          <div className="form-group login-group-enterpage">
            <div className="group-login login-enterline login-enterline-reg">
              <input
                type="text"
                style={{marginRight: '5px'}}
                className="form-control"
                placeholder="email"
                onChange={event => this.setState({email: event.target.value})}
              />
            </div>
            <div className="group-login login-enterline login-enterline-reg">
              <input
                type="password"
                style={{marginRight: '5px'}}
                className="form-control"
                placeholder="password"
                onChange={event => this.setState({password: event.target.value})}
              />
            </div>
            <div className="group-login login-enterline login-enterline-reg">
              <input
                type="text"
                style={{marginRight: '5px'}}
                className="form-control"
                placeholder="your name"
                onChange={event => this.setState({name: event.target.value})}
              />
            </div>
            <div className="group-login">
              <button
                className="btn btn-primary registration-confirm"
                type="button"
                onClick={() => this.signUp()}
              >
                Регистрация
              </button>
            </div>
          </div>
        </div>
        <div className="reg_erron">{this.state.error.message}</div>
        <div className="reg_back"><Link to={'/signin'}>Вернуться на страницу Логина.</Link></div>
      </div>
     </div>
    )
  }
}

export default SignUp;
