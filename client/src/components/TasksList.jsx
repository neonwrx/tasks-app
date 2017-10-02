import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect } from 'react-redux';
import PersonalTask from './PersonalTask';
import Header from './Header';
import { Link } from 'react-router-dom';

class TasksList extends Component {
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

  render() {
    const { name, email } = this.props.user;
    return (
      <div className="page page-mytask">
        <Header />
        <div style={{margin: '60px 50px'}}>
          <Link to={'/'} onClick={this.goToPreviousPage}><i className="fa fa-angle-double-left"></i> Назад</Link>
          <h4 style={{color: '#FFFFFF'}}>
            Список задач <span><em>{ name }</em></span><span> ({ email })</span>
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
