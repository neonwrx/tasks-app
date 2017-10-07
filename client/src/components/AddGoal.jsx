import React, { Component } from 'react';
import { connect } from 'react-redux';
import { goalRef } from '../firebase';
import '../styles/AddGoal.css';
import moment from 'moment';
import 'moment/locale/ru';

class AddGoal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: ''
    }
  }

  _handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.addGoal();
    }
  }

  addGoal() {
    let date = moment();
    const { title } = this.state;
    const { email } = this.props.user;
    if (this.refs.addInput.value) {
      goalRef.push({creator: email, title, created: date.locale('ru').format('LLL'), status: 'Новое', category: '', description: '', attached: ''});
      this.refs.addInput.value = '';
    }
  }

  render() {
    return (
      <div className="form-inline form-addgoal">
        <div className="form-group form-group-addgoal">
        <div className="form-group-title">Новое задание:</div>
        <div className="input-addgoal" >
          <input
            type="text"
            placeholder="Добавить задачу ..."
            className="form-control"
            style={{marginRight: '5px'}}
            ref="addInput"
            onChange={event => this.setState({title: event.target.value})}
            onKeyPress={this._handleKeyPress}
          />
        </div>
          <button
            className="btn btn-success"
            type="button"
            onClick={() => this.addGoal()}
          >
            Создать
          </button>
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

export default connect(mapStateToProps, null)(AddGoal);
