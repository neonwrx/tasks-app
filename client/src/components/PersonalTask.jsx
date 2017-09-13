import React, { Component } from 'react';
import { connect } from 'react-redux';
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
    const { creator, title } = this.props.goal;
    return (
      <div style={{margin: '5px'}}>
        <strong>{ title }</strong> added by <em>{creator}</em>
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
