import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect } from 'react-redux';
import { setCompleted } from '../actions';
import { completeGoalRef } from '../firebase';
import Header from './Header';
import { Link } from 'react-router-dom';
import { Table } from 'reactstrap';

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
        const { email, title, assigned, description, status, attached, message, created, category } = completeGoal.val();
        const serverKey = completeGoal.key;
        completeGoals.push({email, title, assigned, description, status, attached, message, created, category, serverKey})
      })
      this.props.setCompleted(completeGoals);
    })
  }

  clearCompleted() {
    completeGoalRef.set([]);
  }

  render() {
    // const { serverKey } = this.props.completeGoals;
    return (
      <div className="page page-taskcomplite">
        <Header />
        <div style={{margin: '60px 50px'}}>
          <Link to={'/'} onClick={this.goToPreviousPage}><i className="fa fa-angle-double-left"></i> Назад</Link>
          <h4 style={{color: '#FFFFFF'}}>Завершенные задачи</h4>
          <Table hover className="tasks" size="sm">
            <thead>
              <tr>
                <th></th>
                <th className="tasks__title">Название</th>
                <th>Создал</th>
                <th>Дата создания</th>
                <th>Статус</th>
                <th>Категория</th>
              </tr>
            </thead>
            <tbody>
              {
                this.props.completeGoals.map((completeGoal, index) => {
                  const { assigned, title, serverKey, email, created, status, category } = completeGoal;
                  return (
                    <tr key={index}>
                      <td>
                        {
                          this.props.users
                            .filter(user => user.email === assigned)
                            .map((user, index) => {
                              return(
                                <span style={{width: 'auto'}} key={index}>
                                  <img src={require('../../uploads/avatars/' + user.avatar)} alt="avatar" className="avatar" />
                                </span>
                              )
                          })
                        }
                      </td>
                      <td className="tasks__title">
                        <Link to={`/completetasks/${serverKey}`}><strong style={{color: '#F86F71'}}>{title}</strong></Link>
                      </td>
                      <td>
                        {
                          this.props.users
                            .filter(user => user.email === email)
                            .map((user, index) => {
                              return(
                                <span key={index} style={{marginRight: '5px'}}>{user.name}</span>
                              )
                          })
                        }
                        <em style={{color: '#CB98ED'}}>{email}</em>
                      </td>
                      <td>{created}</td>
                      <td>{status}</td>
                      <td>{category}</td>
                    </tr>
                  )
                })
              }
            </tbody>
          </Table>
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
  const { completeGoals, users } = state;
  return  {
    completeGoals,
    users
  }
}

export default connect(mapStateToProps, { setCompleted })(CompleteGoalList);
