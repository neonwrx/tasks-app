import React, { Component } from 'react';
import { connect } from 'react-redux';
import Header from './Header';
import AddGoal from './AddGoal';
import GoalList from './GoalList';
// import CompleteGoalList from './CompleteGoalList';
import '../styles/Header.css';
// import TasksList from './TasksList';

class App extends Component {
  render() {
    return (
      <div className="page">
        <Header />
        <div className="container-fluid">
          {/* <h3>Tasks Master</h3> */}
          <AddGoal />
          {/* <hr /> */}
          {/* <h4 style={{color: '#FFFFFF'}}>Задания</h4> */}
          {/* <hr /> */}
          <br />
          <GoalList />
          {/* <hr /> */}
          {/* <TasksList />
            <hr /> */}
          {/* <h4 style={{color: '#FFFFFF'}}>Выполненные задачи</h4> */}
          {/* <CompleteGoalList /> */}
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  // console.log('state', state);
  return {}
}

export default connect(mapStateToProps, null)(App);
