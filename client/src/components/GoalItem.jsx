import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { goalRef } from '../firebase';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

class GoalItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // buttonName: 'Add for me',
      // disabled: false,
      modal: false,
      dropdownOpen: false,
      title: '',
      assigned: ''
    }

    this.toggle = this.toggle.bind(this);
    this.toggleAssigment = this.toggleAssigment.bind(this);
    this.assignTask = this.assignTask.bind(this);
  }

  componentDidMount() {
    goalRef.on('value', snap => {
      snap.forEach(goal => {
        const { title, assigned } = goal.val();
        const serverKey = goal.key;
        if (serverKey === this.props.goal.serverKey) {
          this.setState({ title: title, assigned: assigned });
        }
      })
    });
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  toggleAssigment() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  // setTask() {
  //   const { email } = this.props.user;
  //   const { serverKey } = this.props.goal;
  //   this.setState({buttonName: 'Added', disabled: true});
  //   goalRef.child(serverKey).update({assigned: email});
  // }

  assignTask(event) {
    const { serverKey } = this.props.goal;
    goalRef.child(serverKey).update({assigned: event.target.value});
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
    const { creator, title, created, serverKey } = this.props.goal;
    return (
      <div className="new-task" style={{margin: '5px'}}>
        <span>{
          this.props.users
            .filter(user => user.email === this.state.assigned)
            .map((user, index) => {
              return(
                <span key={index}>Назначен: {user.name}</span>
              )
          })
        }</span>
        <span><Link to={`/tasks/${serverKey}`}><strong style={{color: '#F86F71'}}>{title}</strong></Link></span>
        <span style={{color: '#FFFFFF'}}> submitted by <em style={{color: '#CB98ED'}}>{creator}</em></span>
        <span>{created}</span>
        <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggleAssigment}>
          {/* <Button
            style={{marginLeft: '5px'}}
            color="primary"
            outline
            size="sm"
            // className="btn btn-sm btn-outline-primary"
            disabled={this.state.disabled}
            onClick={() => this.setTask()}
          >
            {this.state.buttonName}
          </Button> */}
          <DropdownToggle
            caret
            outline
            color="primary"
            size="sm"
          >
            Add for ...
          </DropdownToggle>
          <DropdownMenu>
            {
              this.props.users.map((user, index) => {
                return (
                  <DropdownItem key={index} value={user.email} onClick={(event) => this.assignTask(event)}>{user.name}</DropdownItem>
                )
              })
            }
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
  const { user, users } = state;
  return {
    user,
    users
  }
}

export default connect(mapStateToProps, null)(GoalItem);
