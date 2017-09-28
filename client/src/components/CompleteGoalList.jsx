import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect } from 'react-redux';
import { setCompleted } from '../actions';
import { completeGoalRef } from '../firebase';
import Header from './Header';
import { Link } from 'react-router-dom';

class CompleteGoalList extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)
    this.goToPreviousPage = this.goToPreviousPage.bind(this)
  }

  goToPreviousPage(event) {
    event.preventDefault()
    this.props.history.goBack();
  }

  componentDidMount() {
    completeGoalRef.on('value', snap => {
      let completeGoals = [];
      snap.forEach(completeGoal => {
        const { email, title } = completeGoal.val();
        completeGoals.push({email, title})
      })
      this.props.setCompleted(completeGoals);
    })
  }

  clearCompleted() {
    completeGoalRef.set([]);
  }

  render() {
    return (
      <div>
        <Header />
        <div>
          <Link to={'/'} onClick={this.goToPreviousPage}><i className="fa fa-angle-double-left"></i> Back</Link>
          {
            this.props.completeGoals.map((completeGoal, index) => {
              const { title, email } = completeGoal;
              return (
                <div className="completed-task" key={index}>
                  <span><strong style={{color: '#44E1BD'}}>{title}</strong></span>
                  <span style={{color: '#FFFFFF'}}>completed by <em style={{color: '#CB98ED'}}>{email}</em></span>
                </div>
              )
            })
          }
        </div>
        <button
          style={{marginTop: '5px'}}
          className="btn btn-primary"
          onClick={() => this.clearCompleted()}
          >
          Очистить список
        </button>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { completeGoals } = state;
  return  {
    completeGoals
  }
}

export default connect(mapStateToProps, { setCompleted })(CompleteGoalList);
