import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect } from 'react-redux';
import PersonalTask from './PersonalTask';
import Header from './Header';
import { Link } from 'react-router-dom';
import { Table } from 'reactstrap';

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
    const { email } = this.props.user;
    return (
      <div className="page page-mytask">
        <Header />
        <div style={{margin: '60px 50px'}}>
          <Link to={'/'} onClick={this.goToPreviousPage}><i className="fa fa-angle-double-left"></i> Назад</Link>
          <hr />
          <h4 style={{color: '#FFFFFF'}}>Мои задания</h4>
          <hr />
          <Table hover className="tasks" size="sm">
            <thead>
              <tr>
                <th></th>
                <th className="tasks__title">Название</th>
                <th>Создал</th>
                <th>Дата создания</th>
                <th>Статус</th>
                <th>Категория</th>
                <th className="tasks__edit">Действие</th>
              </tr>
            </thead>
            <tbody>
              {
                this.props.goals
                .filter(goal => goal.assigned === email)
                .map((goal, index) => {
                  return (
                    <PersonalTask key={index} goal={goal} />
                  )
                })
              }
            </tbody>
          </Table>

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
