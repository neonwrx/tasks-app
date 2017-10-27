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
    // console.log('this state', this.state);
    const { email, password } = this.state;
    firebaseApp.auth().signInWithEmailAndPassword(email, password)
      .catch(error => {
        this.setState({error});
      })
  }

  render() {

    return (
      <div className="page-enterpage">
        <div className="title-block-enterpage">Задачи RGK</div>
        <div className="main-block-enterpage offset-1 col-10 offset-sm-2 col-sm-8 offset-md-3 col-md-6 offset-lg-4 col-lg-4">
          <h2>Вход</h2>
          <div className="login-block-enterpage">
            <div className="form-group row login-group-enterpage">
              <label htmlFor="inputEmail3" className="col-sm-3 col-form-label login-name">Логин:</label>
              <div className="offset-sm-1 col-sm-8 login-enterline">
                <input
                  type="text"
                  style={{marginRight: '5px'}}
                  id="inputEmail3"
                  className="form-control"
                  placeholder="email"
                  onChange={event => this.setState({email: event.target.value})}
                />
              </div>
            </div>
            <div className="form-group row login-group-enterpage">
              <label htmlFor="inputPassword3" className="col-sm-3 col-form-label login-name">Пароль:</label>
              <div className="offset-sm-1 col-sm-8 login-enterline">
                <input
                  type="password"
                  style={{marginRight: '5px'}}
                  id="inputPassword3"
                  className="form-control"
                  placeholder="password"
                  onChange={event => this.setState({password: event.target.value})}
                />
              </div>
            </div>
            <div className="enterpage-buttons">
              <div className="registration"><Link to={'/signup'}>Регистрация</Link></div>
              <button className="btn btn-primary button-enter" type="button" onClick={() => this.signIn()}>
                Вход
              </button>
            </div>
          </div>
          <div className="login_erron">{this.state.error.message}</div>
        </div>
      </div>
    )
  }
}

export default SignIn;
