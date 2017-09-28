import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Dropzone from 'react-dropzone';
import { Button, FormGroup, Input, Modal, ModalHeader, ModalBody, ModalFooter, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { goalRef } from '../firebase';

import Header from './Header';
const request = require('superagent');

// import PersonalTask from './PersonalTask';

class Task extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      modal1: false,
      modal2: false,
      dropdownOpen: false,
      title: '',
      description: '',
      files: [],
      status: ''
    }

    this.toggleTitle = this.toggleTitle.bind(this);
    this.toggleDescr = this.toggleDescr.bind(this);
    this.toggleStatus = this.toggleStatus.bind(this);
    this.assignStatus = this.assignStatus.bind(this);
    this.editDescription = this.editDescription.bind(this);
    this.goToPreviousPage = this.goToPreviousPage.bind(this);
  }

  goToPreviousPage(event) {
    event.preventDefault();
    this.props.history.goBack();
  }

  componentDidMount() {
    goalRef.on('value', snap => {
      snap.forEach(goal => {
        const { title, description, attached, status } = goal.val();
        const serverKey = goal.key;
        if (serverKey === this.props.task.serverKey) {
          this.setState({ title: title, description: description, attached: attached, status: status });
        }
      })
    })
  }

  toggleTitle() {
    this.setState({
      modal1: !this.state.modal1
    });
  }

  toggleDescr() {
    this.setState({
      modal2: !this.state.modal2
    });
  }

  toggleStatus() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  assignStatus(event) {
    const { serverKey } = this.props.task;
    goalRef.child(serverKey).update({status: event.target.value});
  }

  editTitle() {
    const { serverKey } = this.props.task;
    goalRef.child(serverKey).update({title: this.state.title});
    this.setState({
      modal1: !this.state.modal1
    });
  }

  editDescription() {
    const { serverKey } = this.props.task;
    if (this.refs.descriptionInput) {
      goalRef.child(serverKey).update({description: this.state.description});
      console.log('what', this.state.description);
    }
    this.setState({
      modal2: !this.state.modal2
    });
  }

  deleteFile(file) {
    const { serverKey, attached } = this.props.task;
    console.log('Delete this file', file);
    let g = [];
    if (attached) {
      attached.split(",").map((file, index) => {
        return (
          g = [...g, file]
        )
      })
    }
    function removeA(arr) {
      var what, a = arguments, L = a.length, ax;
      while (L > 1 && arr.length) {
        what = a[--L];
        // eslint-disable-next-line
        while ((ax = arr.indexOf(what)) !== -1) {
          arr.splice(ax, 1);
        }
      }
      return arr;
    }
    removeA(g, file);
    console.log('g', g);
    goalRef.child(serverKey).update({attached: g.toString()});
  }

  onDrop(acceptedFiles) {
    const { serverKey, attached } = this.props.task;
    this.setState({
      files: acceptedFiles
    });
    const req = request.post('/');
      acceptedFiles.forEach(file => {
        req.attach(file.name, file);
        // this.setState({
        //   files: [...this.state.files, file.name]
        // });
      });
      req.end(function(err, resp) {
        if (err) { console.error(err); }
        return resp;
      });
    let g = [];
    if (attached) {
      attached.split(",").map((file, index) => {
        return (
          g = [...g, file]
        )
      })
    }
    acceptedFiles.map(f => {
      return g = [...g, f.name];
    });
    console.log('g', g);
    goalRef.child(serverKey).update({attached: g.toString()});
  }

  render() {
    const { name, email } = this.props.user;
    const { title, description, attached } = this.props.task;
    // console.log('task', this.props.task.title);
    return(
      <div>
        <Header />
        <div style={{margin: '5px'}}>
          <Link to={'/'} onClick={this.goToPreviousPage}><i className="fa fa-angle-double-left"></i> Back</Link>
          <h4>
            Task for <span><em>{ name }</em></span><span> ({ email })</span>
          </h4>
          <br/>
          <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggleStatus}>
            <DropdownToggle
              caret
              outline
              color="primary"
              size="sm"
            >
              Статус
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem value="Новое" onClick={(event) => this.assignStatus(event)}>Новое</DropdownItem>
              <DropdownItem value="В работе" onClick={(event) => this.assignStatus(event)}>В работе</DropdownItem>
              <DropdownItem value="На проверке" onClick={(event) => this.assignStatus(event)}>На проверке</DropdownItem>
              <DropdownItem value="Выполнено" onClick={(event) => this.assignStatus(event)}>Выполнено</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <span>{this.state.status}</span>
          <div>
            <div>
              <strong>Task:</strong>
              <Button
                outline
                className="fa fa-pencil"
                color="secondary"
                size="sm"
                style={{marginLeft: '5px'}}
                onClick={this.toggleTitle}
              >
              </Button>
            </div>
            <div>{ title }</div>
          </div>
          <hr/>
          <FormGroup>
            {/* <Label for="descriptionText"><strong>Description:</strong></Label> */}
            <div>
              <strong>Description:</strong>
              <Button
                outline
                className="fa fa-pencil"
                color="secondary"
                size="sm"
                style={{marginLeft: '5px'}}
                onClick={this.toggleDescr}
              >
              </Button>
            </div>
            <div><pre>{ description }</pre></div>
          </FormGroup>
          <hr/>
          <div>
            <strong>Attached files: </strong>
            <div>
              {
                attached ?
                  attached.split(",").map((file, index) => {
                    return (
                      <div key={index} style={{marginBottom: '5px'}}>
                        <a href={'/uploads/' + file} download>{file}</a>
                        <Button
                          className="fa fa-times"
                          color="danger"
                          size="sm"
                          style={{marginLeft: '5px'}}
                          onClick={this.deleteFile.bind(this, file)}
                        >
                        </Button>
                      </div>
                    )
                  }) : 'No attached files'
              }
            </div>
          </div>
          <section>
            <div className="dropzone">
              <Dropzone onDrop={this.onDrop.bind(this)}>
                <p>Try dropping some files here, or click to select files to upload.</p>
              </Dropzone>
            </div>
            <aside>
              <h2>Dropped files</h2>
              <ul>
                {
                  this.state.files.map(f => <li key={f.name}>{f.name} - {f.size} bytes</li>)
                }
              </ul>
            </aside>
          </section>
          <Modal isOpen={this.state.modal1} toggle={this.toggleTitle} className={this.props.className}>
            <ModalHeader toggle={this.toggleTitle}>Change task title</ModalHeader>
            <ModalBody>
              <label>Change title of the task</label>
              <input
                type="text"
                placeholder="Edit a task"
                className="form-control"
                style={{marginRight: '5px'}}
                ref="editInput"
                value={ this.state.title }
                onChange={event => this.setState({title: event.target.value})}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={()=> this.editTitle()}>Update</Button>{' '}
              <Button color="secondary" onClick={this.toggleTitle}>Cancel</Button>
            </ModalFooter>
          </Modal>
          <Modal isOpen={this.state.modal2} toggle={this.toggleDescr} className={this.props.className}>
            <ModalHeader toggle={this.toggleDescr}>Change task description</ModalHeader>
            <ModalBody>
              <label>Change description of the task</label>
              <Input
                style={{marginRight: '5px'}}
                type="textarea"
                placeholder="Enter a description"
                name="text"
                rows="5"
                ref="descriptionInput"
                value= {this.state.description}
                onChange={event => this.setState({description: event.target.value})}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={()=> this.editDescription()}>Update</Button>{' '}
              <Button color="secondary" onClick={this.toggleDescr}>Cancel</Button>
            </ModalFooter>
          </Modal>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const { goals, user } = state;
  // console.log('op',task);
  // console.log('op',ownProps);
  return{
    goals,
    user,
    task: state.goals.find(task => task.serverKey === ownProps.match.params.id)
  }
}

export default connect(mapStateToProps, null)(Task);
