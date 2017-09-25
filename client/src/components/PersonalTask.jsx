import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { completeGoalRef, goalRef } from '../firebase';

class PersonalTask extends Component {
  completeGoal() {
    const { email } = this.props.user;
    const { title, serverKey } = this.props.goal;
    goalRef.child(serverKey).remove();
    completeGoalRef.push({email, title});
  }

  render() {
    // console.log('this.props.goal', this.props.goal);
    const { creator, title, serverKey } = this.props.goal;
    return (
      <div style={{margin: '5px'}}>
        <Link to={`/tasks/${serverKey}`}><strong>{title}</strong></Link>
        <span> added by <em>{creator}</em></span>
        <button style={{marginLeft: '5px'}}
          className="btn btn-sm btn-outline-primary"
          onClick={()=> this.completeGoal()}
        >
          Complete
        </button>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { user } = state;
  return {
    user,
  }
}

export default connect(mapStateToProps, null)(PersonalTask);
