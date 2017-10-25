import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { goalRef, completeGoalRef } from '../firebase';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Badge } from 'reactstrap';

class GoalItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal1: false,
      modal2: false,
      dropdownOpen: false,
      changeStatus: false,
      title: '',
      status: ''
    }

    this.toggle = this.toggle.bind(this);
    this.toggleDelete = this.toggleDelete.bind(this);
    this.toggleAssigment = this.toggleAssigment.bind(this);
    this.assignTask = this.assignTask.bind(this);
    this.changeStatus = this.changeStatus.bind(this);
  }

  componentDidMount() {
    goalRef.on('value', snap => {
      snap.forEach(goal => {
        const { title, status } = goal.val();
        const serverKey = goal.key;
        if (serverKey === this.props.goal.serverKey) {
          this.setState({ title: title, status: status });
        }
      })
    });
  }

  toggle() {
    this.setState({
      modal1: !this.state.modal1
    });
  }

  toggleDelete() {
    this.setState({
      modal2: !this.state.modal2
    });
  }

  toggleAssigment() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  changeStatus() {
    this.setState({
      changeStatus: !this.state.changeStatus
    });
  }

  assignTask(event) {
    const { serverKey } = this.props.goal;
    if (event.target.tagName === 'BUTTON') {
      goalRef.child(serverKey).update({assigned: event.target.value});
    } else {
      goalRef.child(serverKey).update({assigned: event.target.parentNode.value});
    }
  }

  deleteTask() {
    const { serverKey } = this.props.goal;
    goalRef.child(serverKey).remove();
    this.setState({
      modal2: !this.state.modal2
    });
  }

  editTask() {
    const { serverKey } = this.props.goal;
    goalRef.child(serverKey).update({title: this.state.title});
    this.setState({
      modal1: !this.state.modal1
    });
  }

  completeGoal() {
    const { email } = this.props.user;
    const { assigned, attached, category, created, finished, creator, description, status, priority, message, title, serverKey } = this.props.goal;
    goalRef.child(serverKey).remove();
    completeGoalRef.push({email, assigned, attached, category, created, finished, creator, description, status, priority, message, title});
  }

  render() {
    // console.log('this.props.goal', this.props.goal);
    const { creator, assigned, title, created, category, priority, status, serverKey } = this.props.goal;
    return (
      <tr>
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
          <Link to={`/tasks/${serverKey}`}><strong style={{color: '#F86F71'}}>{title}</strong></Link>
        </td>
        <td>
          {
            this.props.users
              .filter(user => user.email === creator)
              .map((user, index) => {
                return(
                  <span key={index} style={{marginRight: '5px'}}>{user.name}</span>
                )
            })
          }
          {/* <em style={{color: '#CB98ED'}}>{creator}</em> */}
        </td>
        <td>{created}</td>
        <td className={status === 'Новое' ? 'status--new' : (status === 'Проверено' ? 'status--verified' : (status === 'На доработке' ? 'status--on-complection' : (status === 'В работе' ? 'status--work' : 'status--done')))}>
          {/* {(() => {
            if (this.state.changeStatus) {
              return (
                <span onClick={() => this.changeStatus()}>Changed</span>
              )

            } else {
              return (
                <span onClick={() => this.changeStatus()}>{status}</span>
              )
            }
          })()} */}
          {status}
        </td>
        <td><Badge color={priority === 'Обычный' ? 'success' : (priority === 'Высокий' ? 'danger' : 'warning')} pill>{priority}</Badge></td>
        <td><Badge color={category === 'На тест' ? 'primary' : 'info'}>{category}</Badge></td>
        <td className="tasks__edit">
          <ButtonDropdown tether isOpen={this.state.dropdownOpen} toggle={this.toggleAssigment}>
            <DropdownToggle
              caret
              outline
              color="info"
              size="sm"
            >
              Add for ...
            </DropdownToggle>
            <DropdownMenu>
              {
                this.props.users
                .filter(user => user.rights !== 'Гость')
                .map((user, index) => {
                  return (
                    <DropdownItem key={index} value={user.email} onClick={(event) => this.assignTask(event)}>
                      <img className="avatar" value={user.email} src={require('../../uploads/avatars/' + user.avatar)} alt="" style={{marginRight: '8px'}} />
                      <span>{user.name}</span>
                    </DropdownItem>
                  )
                })
              }
              <DropdownItem divider />
              <DropdownItem value="" onClick={(event) => this.assignTask(event)}>Отвязать</DropdownItem>
            </DropdownMenu>
          </ButtonDropdown>
          <Button
            outline
            className="fa fa-pencil"
            color="secondary"
            size="sm"
            style={{marginLeft: '5px'}}
            onClick={this.toggle}
          >
          </Button>
          <Button
            color="danger"
            size="sm"
            style={{marginLeft: '5px'}}
            className="fa fa-times"
            onClick={this.toggleDelete}
          >
          </Button>
          <Button
            outline
            color="success"
            size="sm"
            style={{marginLeft: '5px'}}
            onClick={() => this.completeGoal()}
          >
            Завершить
          </Button>
        </td>
        <Modal isOpen={this.state.modal1} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}>Change task title</ModalHeader>
          <ModalBody>
            <label>Change title of task</label>
            <input
              type="text"
              placeholder="Edit a task"
              className="form-control"
              style={{marginRight: '5px'}}
              ref="editInput"
              value= { this.state.title }
              onChange={event => this.setState({title: event.target.value})}
            />
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={()=> this.editTask()}>Update</Button>{' '}
            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
        <Modal isOpen={this.state.modal2} toggle={this.toggleDelete} className={this.props.className}>
          <ModalHeader toggle={this.toggleDelete}>Удалить задачу?</ModalHeader>
          <ModalBody>
            <label>Вы уверены что хотите удалить задачу, обратного пути уже небудет?</label>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={()=> this.deleteTask()}>Удалить</Button>{' '}
            <Button color="secondary" onClick={this.toggleDelete}>Отмена</Button>
          </ModalFooter>
        </Modal>
      </tr>
    )
  }
}

function mapStateToProps(state) {
  const { user, users } = state;
  return {
    user,
    users
  }
}

export default connect(mapStateToProps, null)(GoalItem);
