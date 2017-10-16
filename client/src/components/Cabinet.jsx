import React, { Component } from 'react';
import { connect } from 'react-redux';
import Header from './Header';
import { Input, Button } from 'reactstrap';
import { userListRef } from '../firebase';
import '../styles/Cabinet.css';

class Cabinet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: ''
    }
  }

  componentDidMount() {
    userListRef.on('value', snap => {
      snap.forEach(goal => {
        const { name } = goal.val();
        const serverKey = goal.key;
        if (serverKey === this.props.user.serverKey) {
          this.setState({ name: name });
        }
      })
    });
  }

  changeName() {
    const { name } = this.state;
    const { serverKey } = this.props.user;
    if (this.input.value) {
      userListRef.child(serverKey).update({name: name});
    }
  }

  render() {
    const { email, avatar, rights } = this.props.user;
    // console.log(this.props.user);
    return (
      <div>
        <Header />
        <br/>
        <br/>
        <br/>
        <div className="container">
          <div className="wrap">
            <div className="image">
              <img className="avatar-lg" src={require(`../../uploads/avatars/${avatar}`)} alt="" />
            </div>
            <div style={{marginBottom: '5px'}}>Email: {email}</div>
            <div className="form-inline">
              <div className="form-group nulled">
                <span>Имя: </span>
                <Input
                  style={{marginRight: '5px'}}
                  size="sm"
                  className="form-control"
                  type="text"
                  placeholder="Ваше имя"
                  getRef={(input) => (this.input = input)}
                  // value= {(this.state.name) ? this.state.name : name}
                  value= {this.state.name}
                  onChange={event => this.setState({name: event.target.value})}
                />
                <Button
                  outline
                  className="fa fa-floppy-o"
                  color="secondary"
                  size="sm"
                  style={{marginLeft: '5px'}}
                  onClick={() => this.changeName()}
                >
                </Button>
              </div>
            </div>
            <div>Права доступа: {rights}</div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { user } = state;
  return {
    user
  }
}

export default connect(mapStateToProps, null)(Cabinet);
