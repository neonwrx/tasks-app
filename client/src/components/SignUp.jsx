import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { firebaseApp, userListRef } from '../firebase';

class SignUp extends Component {
  constructor(props) {
    super(props);
    const id = Math.random().toString(36).substr(2, 9);
    this.state = {
      email: '',
      password: '',
      name: '',
      id: id,
      error: {
        message: ''
      }
    }
  }

  signUp() {
    console.log('this state', this.state);
    const { email, password, name, id } = this.state;
    firebaseApp.auth().createUserWithEmailAndPassword(email, password)
      .catch(error => {
        this.setState({error});
      })
      .then(function() {
        userListRef.push({email, name, id})
      });
  }

  render() {
    return (
      <div style={{margin: '5%'}}>
        <h2>Sign Up</h2>
        <div className="form-inline">
          <div className="form-group">
            <input
              type="text"
              style={{marginRight: '5px'}}
              className="form-control"
              placeholder="email"
              onChange={event => this.setState({email: event.target.value})}
            />
            <input
              type="password"
              style={{marginRight: '5px'}}
              className="form-control"
              placeholder="password"
              onChange={event => this.setState({password: event.target.value})}
            />
            <input
              type="text"
              style={{marginRight: '5px'}}
              className="form-control"
              placeholder="your name"
              onChange={event => this.setState({name: event.target.value})}
            />
            <button
              className="btn btn-primary"
              type="button"
              onClick={() => this.signUp()}
            >
              Sign Up
            </button>
          </div>
        </div>
        <div>{this.state.error.message}</div>
        <div><Link to={'/signin'}>Already a user? sign in instead</Link></div>
      </div>
    )
  }
}

export default SignUp;
