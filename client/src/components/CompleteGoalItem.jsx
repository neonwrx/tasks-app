import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { completeGoalRef } from '../firebase';

class CompleteGoalItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal2: false
    }
    this.toggleDelete = this.toggleDelete.bind(this);
  }

  toggleDelete() {
    this.setState({
      modal2: !this.state.modal2
    });
  }

  deleteTask() {
    const { serverKey } = this.props.completeGoal;
    completeGoalRef.child(serverKey).remove();
    this.setState({
      modal2: !this.state.modal2
    });
  }

  render() {
    const { assigned, title, serverKey, email, created, status, category } = this.props.completeGoal;
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

export default connect(mapStateToProps, null)(CompleteGoalItem);
