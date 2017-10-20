import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect } from 'react-redux';
import { setCompleted, setUsers } from '../actions';
import { completeGoalRef, userListRef } from '../firebase';
import Header from './Header';
import CompleteGoalItem from './CompleteGoalItem';
import Pagination from './Pagination';
import { Link } from 'react-router-dom';
import { Table } from 'reactstrap';

class CompleteGoalList extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      isLoad: false,
      goalslist: [],
      pageOfItems: []
    }

    this.goToPreviousPage = this.goToPreviousPage.bind(this);
    this.onChangePage = this.onChangePage.bind(this);
  }

  goToPreviousPage(event) {
    event.preventDefault()
    this.props.history.goBack();
  }

  componentDidMount() {
    completeGoalRef.on('value', snap => {
      let completeGoals = [];
      snap.forEach(completeGoal => {
        const { email, title, assigned, description, status, attached, message, created, finished, category } = completeGoal.val();
        const serverKey = completeGoal.key;
        completeGoals.push({email, title, assigned, description, status, attached, message, created, finished, category, serverKey})
      })
      this.props.setCompleted(completeGoals);
      this.setState({goalslist: completeGoals.reverse(), isLoad: true});
    });
    userListRef.on('value', snap => {
      let users = [];
      snap.forEach(user => {
        const { email, name, avatar } = user.val();
        users.push({ email, name, avatar });
      })
      this.props.setUsers(users);
    })
  }

  clearCompleted() {
    completeGoalRef.set([]);
  }

  onChangePage(pageOfItems) {
      // update state with new page of items
      this.setState({pageOfItems: pageOfItems});
  }

  render() {
    return (
      <div className="page page-taskcomplite">
        <Header />
        <div style={{margin: '60px 50px'}}>
          <Link to={'/'} onClick={this.goToPreviousPage}><i className="fa fa-angle-double-left"></i> Назад</Link>
          <hr/>
          <h4 style={{color: '#FFFFFF'}}>Завершенные задачи</h4>
          <hr/>
          {(() => {
            if (this.state.isLoad) {
              return (
                <div>
                  <Table hover className="tasks" size="sm">
                    <thead>
                      <tr>
                        <th></th>
                        <th className="tasks__title">Название</th>
                        <th>Создал</th>
                        <th>Дата создания</th>
                        <th>Дата завершения</th>
                        <th>Статус</th>
                        <th>Категория</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        this.state.pageOfItems.map((completeGoal, index) => {
                          return (
                            <CompleteGoalItem key={index} completeGoal={completeGoal} />
                          )
                        })
                      }
                    </tbody>
                  </Table>
                  <Pagination items={this.state.goalslist} onChangePage={this.onChangePage} />
                </div>
              )
            } else {
              return (
                <div style={{textAlign: 'center'}}>
                  <i className="fa fa-spinner fa-pulse fa-2x fa-fw"></i>
                </div>
              )
            }
          })()}
        </div>
        {(() => {
          if (this.props.user.rights === 'Администратор') {
            return (
              <button
                style={{marginTop: '5px'}}
                className="btn btn-primary"
                onClick={() => this.clearCompleted()}
                >
                  Очистить список
                </button>
              )
            }
        })()}
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { completeGoals, user } = state;
  return  {
    completeGoals,
    user
  }
}

export default connect(mapStateToProps, { setCompleted, setUsers })(CompleteGoalList);
