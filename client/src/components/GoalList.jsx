import React, { Component } from 'react';
import { connect } from 'react-redux';
import { goalRef, userListRef } from '../firebase';
import { setGoals } from '../actions';
import { setUsers } from '../actions';
import GoalItem from './GoalItem';

class GoalList extends Component {
  componentDidMount() {
    goalRef.on('value', snap => {
      let goals = [];
      snap.forEach(goal => {
        const { creator, title, assigned, description, attached, created } = goal.val();
        const serverKey = goal.key;
        goals.push({ creator, title, assigned, description, attached, created, serverKey });
      })
      this.props.setGoals(goals);
    });
    userListRef.on('value', snap => {
      let users = [];
      snap.forEach(user => {
        const { email, name } = user.val();
        users.push({ email, name });
      })
      this.props.setUsers(users);
    })
  }

  render() {
    console.log('this.props.goals', this.props.goals);
    return (
      <div>
        {
          this.props.goals.map((goal, index) => {
            return (
              <GoalItem key={index} goal={goal} />
            )
          })
        }
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { goals, users } = state;
  return {
    goals,
    users
  }
}

export default connect(mapStateToProps, { setGoals, setUsers })(GoalList);
