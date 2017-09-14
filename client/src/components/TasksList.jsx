import React, { Component } from 'react';
import {connect } from 'react-redux';
import PersonalTask from './PersonalTask';

class TasksList extends Component {

  render() {
    const { name, email } = this.props.user;
    return (
      <div>
        <h4>
          List of tasks for <span><em>{ name }</em></span><span> ({ email })</span>
        </h4>
        {
          this.props.goals.map((goal, index) => {
            const { assigned } = goal;
            if ( assigned === email ) {
              return (
                <PersonalTask key={index} goal={goal} />
              )
            }
            return false;
          })
        }
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { user, goals } = state;
  return  {
    user,
    goals
  }
}

export default connect(mapStateToProps, null)(TasksList);
