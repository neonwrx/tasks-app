import React, { Component } from 'react';
import { connect } from 'react-redux';
import { goalRef } from '../firebase';
import '../styles/AddGoal.css';

class AddGoal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: ''
    }
  }

  addGoal() {
    let d = new Date();
    function formatDate(date) {
      let dd = date.getDate();
      if (dd < 10) dd = '0' + dd;
      let month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      let yy = date.getFullYear();
      let hh = date.getHours();
      let mm = date.getMinutes();

      return dd + ' ' + month[date.getMonth()] + ' ' + yy + ' | ' + hh + ':' + mm;
    };
    // console.log('this', this);
    const { title } = this.state;
    const { email } = this.props.user;
    goalRef.push({creator: email, title, created: formatDate(d)});
    this.refs.addInput.value = '';
  }

  render() {
    return (
      <div className="form-inline form-addgoal">
        <div className="form-group form-group-addgoal">
        <div className="form-group-title">Новое задание:</div>
        <div>
          <input
            type="text"
            placeholder="Добавить задачу ..."
            className="form-control"
            style={{marginRight: '5px'}}
            ref="addInput"
            onChange={event => this.setState({title: event.target.value})}
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
