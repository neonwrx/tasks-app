import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect } from 'react-redux';
import { setCompleted } from '../actions';
import { completeGoalRef } from '../firebase';
import Header from './Header';
import { Link } from 'react-router-dom';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Table } from 'reactstrap';

class CompleteGoalList extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      modal2: false
    }
    this.toggleDelete = this.toggleDelete.bind(this);
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

  toggleDelete() {
    this.setState({
      modal2: !this.state.modal2
    });
  }

  deleteTask() {
    // const { serverKey } = this.props.completeGoal;
    // console.log(serverKey);
    // completeGoalRef.child(serverKey).remove();
    this.setState({
      modal2: !this.state.modal2
    });
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
          <hr/>
          <h4 style={{color: '#FFFFFF'}}>Завершенные задачи</h4>
          <hr/>
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
                    <tr key={index} completeGoal={serverKey}>
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
                      <td className="tasks__edit">
                        <Button
                          color="danger"
                          size="sm"
                          style={{marginLeft: '5px'}}
                          className="fa fa-times"
                          onClick={this.toggleDelete}
                        >
                        </Button>
                      </td>
                      <Modal isOpen={this.state.modal2} toggle={this.toggleDelete} className={this.props.className}>
                        <ModalHeader toggle={this.toggleDelete}>Удалить задачу?</ModalHeader>
                        <ModalBody>
                          <label>Нехер задачи удалять?</label>
                        </ModalBody>
                        <ModalFooter>
                          {/* <Button color="primary" onClick={()=> this.deleteTask()}>Удалить</Button>{' '} */}
                          <Button color="secondary" onClick={this.toggleDelete}>Отмена</Button>
                        </ModalFooter>
                      </Modal>
                    </tr>
                  )
                })
              }
            </tbody>
          </Table>
        </div>
        {(() => {
          if (this.props.user.email === 'rolexxx91@gmail.com') {
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
  const { completeGoals, users, user } = state;
  return  {
    completeGoals,
    users,
    user
  }
}

export default connect(mapStateToProps, { setCompleted })(CompleteGoalList);
