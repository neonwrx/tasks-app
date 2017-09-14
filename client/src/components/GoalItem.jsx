import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { goalRef } from '../firebase';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class GoalItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buttonName: 'Add for me',
      modal: false,
      title: ''
    }

    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    goalRef.on('value', snap => {
      snap.forEach(goal => {
        const { title } = goal.val();
        const serverKey = goal.key;
        if (serverKey === this.props.goal.serverKey) {
          this.setState({ title: title });
        }
      })
    })
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  setTask() {
    const { email } = this.props.user;
    const { serverKey } = this.props.goal;
    this.setState({buttonName: 'Added'});
    goalRef.child(serverKey).update({assigned: email});
  }

  deleteTask() {
    const { serverKey } = this.props.goal;
    goalRef.child(serverKey).remove();
  }

  editTask() {
    const { serverKey } = this.props.goal;
    goalRef.child(serverKey).update({title: this.state.title});
    this.setState({
      modal: !this.state.modal
    });
  }

  render() {
    // console.log('this.props.goal', this.props.goal);
    const { creator, title, serverKey } = this.props.goal;
    return (
      <div style={{margin: '5px'}}>
        <Link to={`/tasks/${serverKey}`}><strong>{title}</strong></Link>
        <span style={{marginRight: '5px'}}> submitted by <em>{creator}</em></span>
        <button style={{marginLeft: '5px'}}
          className="btn btn-sm btn-outline-primary"
          onClick={()=> this.setTask()}
        >
          { this.state.buttonName }
        </button>
        <Button
          outline
          className="fa fa-pencil"
          color="secondary"
          size="sm"
          style={{marginLeft: '5px'}}
          onClick={this.toggle}
        >
        </Button>
        <button style={{marginLeft: '5px'}}
          className="btn btn-sm btn-danger fa fa-times"
          onClick={()=> this.deleteTask()}
        >
        </button>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
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
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { user } = state;
  return {
    user
  }
}

export default connect(mapStateToProps, null)(GoalItem);
