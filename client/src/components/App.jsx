import React, { Component } from 'react';
import { connect } from 'react-redux';
import Header from './Header';
import AddGoal from './AddGoal';
import GoalList from './GoalList';
import '../styles/Header.css';

class App extends Component {
  render() {
    return (
      <div className="page">
        <Header />
        <div className="container-fluid">
          <AddGoal />
          <br />
          <GoalList />
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
