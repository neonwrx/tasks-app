import React, { Component } from 'react';
import { connect } from 'react-redux';
import { TabContent, TabPane, Nav, NavItem, NavLink, Button, Row, Col, FormGroup, Label, Input } from 'reactstrap';
import classnames from 'classnames';
// import trim from 'trim';
import { userListRef, messageListRef } from '../firebase';
import { setMessages } from '../actions';
import Message from './Message';


class MessageList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: '1',
      message: ''
    };

    this.toggle = this.toggle.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onKeyup = this.onKeyup.bind(this);
    this.addMessage = this.addMessage.bind(this);
  }

  componentDidMount() {
    messageListRef.on('value', snap => {
      let messages = [];
      snap.forEach(msg => {
        const serverKey = msg.key;
        const { name, message } = msg.val();
        messages.push({ name, message, serverKey });
      })
      this.props.setMessages(messages);
    });
  }

  onChange(e){
      this.setState({
        message: e.target.value
      });
  }
  onKeyup(e){
    const { name } = this.props.user;
    if(e.keyCode === 13 && e.target.value !== ''){
      e.preventDefault();
      messageListRef.push({message: e.target.value, name});
      this.props.users.map((user,index) => {
        if (this.props.user.serverKey !== user.serverKey) {
          return (
            userListRef.child(user.serverKey).update({unreadMessage: true})
          )
        } else {
          return false;
        }
      });
      this.setState({
        message: ''
      });
    }
  }

  addMessage(e) {
    e.preventDefault();
    const { name } = this.props.user;
    if (this.textInput.props.value) {
      messageListRef.push({message: this.textInput.props.value, name});
      this.props.users.map((user,index) => {
        if (this.props.user.serverKey !== user.serverKey) {
          return (
            userListRef.child(user.serverKey).update({unreadMessage: true})
          )
        } else {
          return false;
        }
      });
      // this.textInput.props.value = '';
      this.setState({
        message: ''
      });
    }
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  deleteNotification(file) {
    const { serverKey, userMessage } = this.props.user;
    console.log('Delete this file', file);
    let m = [];
    if (userMessage) {
      userMessage.split(",").map((file, index) => {
        return (
          m = [...m, file]
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
    removeA(m, file);
    console.log('m', m);
    userListRef.child(serverKey).update({userMessage: m.toString()})
  }

  render() {
    const { userMessage } = this.props.user;
    if (userMessage.length) {
      return (
        <div className="message-list">
          <Nav tabs size="sm">
            <NavItem>
              <NavLink
                className={classnames({ active: this.state.activeTab === '1' })}
                onClick={() => { this.toggle('1'); }}
              >
                Уведомления
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: this.state.activeTab === '2' })}
                onClick={() => { this.toggle('2'); }}
              >
                Сообщения
              </NavLink>
            </NavItem>
          </Nav>
          <div className="container-fluid message-wrap">
            <div>
              <TabContent activeTab={this.state.activeTab}>
                <TabPane tabId="1">
                  {
                    userMessage.split(",").reverse().map((singleMessage, index) => {
                      return (
                        <div className="message-item row" key={index}>
                          <div className="col-md-10">
                            {(() => {
                              let strings = singleMessage.split("$#");
                              return (
                                <div>
                                  {/* <div>{strings[0]}</div> */}
                                  <a href={'http://192.168.3.210:8000/tasks/'+ strings[2]}>{strings[0]}</a>
                                  <span>{strings[1]}</span>
                                  {/* <span><a href={'http://192.168.3.210:8000/tasks/'+ strings[2]}>Открыть</a></span> */}
                                </div>
                              )
                            })()}
                          </div>
                          <div className="col-md-2">
                            <Button
                              outline
                              color="danger"
                              size="sm"
                              style={{marginLeft: '5px'}}
                              className="fa fa-times"
                              onClick={this.deleteNotification.bind(this, singleMessage)}
                            >
                            </Button>
                          </div>
                        </div>
                      )
                    })
                  }
                </TabPane>
                <TabPane tabId="2">
                  {/* <Row className="message-item">
                    <Col sm="12">
                      <div className="message-creator">Антон Ковтун</div>
                      <div className="message">Привет</div>
                    </Col>
                  </Row>
                  <Row className="message-item">
                    <Col sm="12">
                      <div className="message-creator">Сергей Момот</div>
                      <div className="message">Как дела?</div>
                    </Col>
                  </Row> */}
                  {
                    this.props.messages.map((msg,index) => {
                      return(
                        <Message key={index} msg={msg} />
                      )
                    })
                  }
                  <Row className="message-item">
                      {/* <Form inline style={{width: '100%'}}> */}
                        <Col sm="9">
                          <FormGroup>
                            <Label for="exampleText" hidden>Email</Label>
                            <Input
                              size="sm"
                              type="text"
                              name="text"
                              id="exampleText"
                              ref={(input) => { this.textInput = input; }}
                              style={{marginRight: '5px', width: '100%'}}
                              placeholder="Напишите ваше сообщение..."
                              onChange={this.onChange}
                              onKeyUp={this.onKeyup}
                              value={this.state.message}
                            />
                          </FormGroup>
                        </Col>
                        <Col sm="3">
                          <Button
                            size="sm"
                            color="success"
                            outline
                            onClick={this.addMessage}
                          >
                            Отправить
                          </Button>
                        </Col>
                      {/* </Form> */}
                  </Row>
                </TabPane>
              </TabContent>
            </div>
          </div>
        </div>
      )
    } else {
      return null
    }
  }
}

// export default MessageList;
function mapStateToProps(state) {
  const { messages, users } = state;
  return {
    messages,
    users
  }
}

export default connect(mapStateToProps, { setMessages })(MessageList);
