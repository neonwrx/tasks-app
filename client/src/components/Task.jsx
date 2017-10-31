import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Dropzone from 'react-dropzone';
import { Button, FormGroup, Input, Modal, ModalHeader, ModalBody, ModalFooter, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import Linkify from 'react-linkify';
import { goalRef, userListRef } from '../firebase';
import { setGoal, setGoals, setUsers, setNotification } from '../actions';
import '../styles/Task.css';
import moment from 'moment';
import 'moment/locale/ru';
// import NotificationSystem from 'react-notification-system';

import Header from './Header';
// import Notification1 from './Notification1';
import alerts from '../alerts.json';
const request = require('superagent');

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
      dropdownCategoryOpen: false,
      dropdownPriorityOpen: false,
      title: '',
      description: '',
      files: [],
      status: '',
      attached: '',
      priority: '',
      category: '',
      finished: ''
    }

    this.toggleTitle = this.toggleTitle.bind(this);
    this.toggleDescr = this.toggleDescr.bind(this);
    this.toggleStatus = this.toggleStatus.bind(this);
    this.togglePriority = this.togglePriority.bind(this);
    this.toggleCategory = this.toggleCategory.bind(this);
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
      let goals = [];
      snap.forEach(goal => {
        const { creator, title, assigned, description, status, attached, message, created, finished, priority, category, notify } = goal.val();
        const serverKey = goal.key;
        if (serverKey === this.props.paramsId) {
          this.setState({ title: title, description: description, attached: attached, status: status, priority: priority, category: category, finished: finished, notify: notify });
        }
        goals.push({ creator, title, assigned, description, status, attached, message, created, finished, priority, category, notify, serverKey });
      });
      this.props.setGoals(goals);
    });
    userListRef.on('value', snap => {
      let users = [];
      snap.forEach(user => {
        const serverKey = user.key;
        // const { email, name, avatar, rights } = user.val();
        users.push({ serverKey });
      })
      this.props.setUsers(users);
    });
  }

  componentWillReceiveProps(nextProps) {
    // console.log('nextProps', nextProps);
    let task = nextProps.goals.find(task => task.serverKey === this.props.paramsId);
    this.props.setGoal(task);
    const { title, description, attached, status, priority, category, finished } = nextProps.task;
    this.setState({ title: title, description: description, attached: attached, status: status, priority: priority, category: category, finished: finished });
  }

  // _addNotification = (event) => {
  //   event.preventDefault();
  //   // this.props.setNotification('happy days', 'success');
  //   const { serverKey } = this.props.task;
  //   goalRef.child(serverKey).update({notify: true});
  //   setTimeout(() => {goalRef.child(serverKey).update({notify: false});}, 2000);
  //   this.setState({notifyCreator: this.props.user.email});
  // }

  // messageForMe() {
  //   let rand = alerts[Math.floor(Math.random() * alerts.length)];
  //   alert(rand);
  // }

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

  togglePriority() {
    this.setState({
      dropdownPriorityOpen: !this.state.dropdownPriorityOpen
    });
  }

  toggleCategory() {
    this.setState({
      dropdownCategoryOpen: !this.state.dropdownCategoryOpen
    });
  }

  assignStatus(event) {
    const { serverKey, message, title } = this.props.task;
    const { name, userMessage } = this.props.user;
    let g = [];
    if (message) {
      message.split(",").map((messageStatus, index) => {
        return (
          g = [...g, messageStatus]
        )
      })
    }
    let m = [];
    if (userMessage) {
      userMessage.split(",").map((messageStatus, index) => {
        return (
          m = [...m, messageStatus]
        )
      })
    }
    let newMessage = name + ' изменил статус на "' + event.target.value + '"';
    let newMesssageListItem = name + ' завершил задачу «' + title + '» $#' + moment(new Date()).format('DD MMMM YYYY г. HH:mm') + '$#' + serverKey;
    g = [...g, newMessage];
    m = [...m, newMesssageListItem];
    // console.log('g', g);
    goalRef.child(serverKey).update({status: event.target.value, message: g.toString()});
    if ((event.target.value === 'Выполнено') && (this.state.status !== 'Выполнено')) {
      goalRef.child(serverKey).update({finished: moment(new Date()).format('DD MMMM YYYY г. HH:mm')});
      // this.props.setNotification({notification: true});
      this.props.users.map((user,index) => {
        return (
          userListRef.child(user.serverKey).update({userMessage: m.toString(), unreadMessage: true})
        );
      });
      let rand = alerts[Math.floor(Math.random() * alerts.length)];
      alert(rand);
    }
  }

  assignPriority(event) {
    const { serverKey } = this.props.task;
    goalRef.child(serverKey).update({priority: event.target.value});
  }

  assignCategory(event) {
    const { serverKey } = this.props.task;
    goalRef.child(serverKey).update({category: event.target.value});
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
      // console.log('what', this.state.description);
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
    // console.log('g', g);
    goalRef.child(serverKey).update({attached: g.toString()});
    const req = request.post('/del');
    req.attach(file, file);
    req.end(function(err, resp) {
      if (err) { console.error(err); }
      return resp;
    });
  }

  onDrop(acceptedFiles) {
    const { serverKey, attached } = this.props.task;
    this.setState({
      files: acceptedFiles
    });
    console.log('acceptedFiles', acceptedFiles);
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
    // const { name, email } = this.props.user;
    const { title, description, attached, message } = this.props.task;
    // console.log('task', this.props.task.title);
    return(
      <div>
        <Header />
        <div className="block-task-container container-fluid">
          <div className="task-button-back">
            <Link to={'/'} onClick={this.goToPreviousPage}><i className="fa fa-angle-double-left"></i> Закрыть</Link>
          </div>
          <br/>
          <div className="block-Dropdown-wrap">
            <div className="block-Dropdown">
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
                  <DropdownItem value="Проверено" onClick={(event) => this.assignStatus(event)}>Проверено</DropdownItem>
                  <DropdownItem value="На доработке" onClick={(event) => this.assignStatus(event)}>На доработке</DropdownItem>
                  <DropdownItem value="В работе" onClick={(event) => this.assignStatus(event)}>В работе</DropdownItem>
                  <DropdownItem value="Выполнено" onClick={(event) => this.assignStatus(event)}>Выполнено</DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <span>{this.state.status}</span>
            </div>
            <div className="block-Dropdown">
              <Dropdown isOpen={this.state.dropdownPriorityOpen} toggle={this.togglePriority}>
                <DropdownToggle
                  caret
                  outline
                  color="primary"
                  size="sm"
                >
                  Приоритет
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem value="Обычный" onClick={(event) => this.assignPriority(event)}>Обычный</DropdownItem>
                  <DropdownItem value="Низкий" onClick={(event) => this.assignPriority(event)}>Низкий</DropdownItem>
                  <DropdownItem value="Высокий" onClick={(event) => this.assignPriority(event)}>Высокий</DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <span>{this.state.priority}</span>
            </div>
            <div className="block-Dropdown">
              <Dropdown isOpen={this.state.dropdownCategoryOpen} toggle={this.toggleCategory}>
                <DropdownToggle
                  caret
                  outline
                  color="primary"
                  size="sm"
                >
                  Категория
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem value="На тест" onClick={(event) => this.assignCategory(event)}>На тест</DropdownItem>
                  <DropdownItem value="Согласование" onClick={(event) => this.assignCategory(event)}>Согласование</DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <span>{this.state.category}</span>
            </div>
          </div>
          <hr/>
          <div>
            <div>
              <strong style={{color: '#FFFFFF'}}>Название:</strong>
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
            <div className="name-field">{ title }</div>
          </div>
          <hr/>
          <FormGroup>
            {/* <Label for="descriptionText"><strong>Description:</strong></Label> */}
            <div>
              <strong style={{color: '#FFFFFF'}}>Описание:</strong>
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
            <div className="name-field"><pre><Linkify properties={{target: '_blank'}}>{ description }</Linkify></pre></div>
            {/* <div>{ this.state.description }</div> */}
          </FormGroup>
          <hr/>
          <div>
            <strong style={{color: '#FFFFFF'}}>Прикрепленные файлы: </strong>
            <div>
              {
                attached ?
                  attached.split(",").map((file, index) => {
                    return (
                      <div key={index} style={{marginBottom: '10px'}} className="attachedFile">
                        <a href={'/uploads/' + file} download>
                          {(() => {
                            let ext = file.split('.').pop();
                            switch (ext) {
                              case 'zip':
                                return <img src={require('../images/icon_zip.svg')} alt=""/>
                                break; // eslint-disable-line no-unreachable
                              case 'rar':
                                return <img src={require('../images/icon_rar.svg')} alt=""/>
                                break; // eslint-disable-line no-unreachable
                              case 'gif':
                                return <img src={require('../images/icon_gif.svg')} alt=""/>
                                break; // eslint-disable-line no-unreachable
                              case 'psd':
                                return <img src={require('../images/icon_psd.svg')} alt=""/>
                                break; // eslint-disable-line no-unreachable
                              case 'png':
                              case 'jpg':
                                // return <img src={require(`../../../uploads/${file}`)} alt=""/>
                                return <img src={'/uploads/' + file} alt=""/>
                                break; // eslint-disable-line no-unreachable
                              default:
                                return <img src={require('../images/icon_other.svg')} alt=""/>
                            }
                          })()}
                          <span>{file}</span>
                        </a>
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
                  }) : 'Нет прикрепленных файлов'
              }
            </div>
          </div>
          <section>
            <div className="dropzone">
              <Dropzone onDrop={this.onDrop.bind(this)}>
                <p>Перетащите файлы сюда или нажмите для загрузки файлов</p>
              </Dropzone>
            </div>
            {/*<aside>
              <h2>Dropped files</h2>
              <ul>
                {
                  this.state.files.map(f => <li key={f.name}>{f.name} - {f.size} bytes</li>)
                }
              </ul>
            </aside>*/}
          </section>
          <hr/>
          <div>
            {
              message ? message.split(",").map((singleMessage, index) => {
                return (
                  <div key={index}>{singleMessage}</div>
                )
              }) : ''
            }
            <br/>
            {
              this.state.finished ? <div style={{color: '#cb98ed'}}>Выполнено {this.state.finished}</div> : ''
            }
          </div>
          {/* <Button
            color="secondary"
            outline
            onClick={this.messageForMe.bind(this)}
          >
            Message
          </Button> */}
          {/* <button onClick={this.messageForMe.bind(this)}>Message</button> */}
          {/* <button onClick={this._addNotification}>Add notification</button> */}
          {/* <NotificationSystem ref="notificationSystem" /> */}
          {/* <Notification1 ref="child" /> */}
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
  const { goals, user, users, task, notification } = state;
  // console.log('op',ownProps);
  // if () {
  //
  // }
  // const task = state.goals.find(task => task.serverKey === ownProps.match.params.id)
  // console.log('task',task);
  // console.log('goals',goals);
  return {
    paramsId: ownProps.match.params.id,
    goals,
    user,
    users,
    task,
    notification
    // task: state.goals.find(task => task.serverKey === ownProps.match.params.id)
  }
}

export default connect(mapStateToProps, { setGoal, setGoals, setUsers, setNotification })(Task);
