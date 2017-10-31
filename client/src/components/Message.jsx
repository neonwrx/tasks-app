import React, { Component } from 'react';
import { messageListRef } from '../firebase';
import { Row, Col, Button } from 'reactstrap';

class Message extends Component {
  constructor(props){
    super(props);
    this.state = {
      showDelButton: false
    };
  }

  onMouseEnter() {
    this.setState({showDelButton: true})
  }

  onMouseLeave(e) {
    if (e.target.classList[0] !== 'del-button') {
      this.setState({showDelButton: false});
    }
  }

  deleteMessage() {
    const { serverKey } = this.props.msg;
    messageListRef.child(serverKey).remove();
  }

  render() {
    const { name, message } = this.props.msg;
    return (
      <Row
        className="message-item"
        onMouseOver={this.onMouseEnter.bind(this)}
        onMouseOut={this.onMouseLeave.bind(this)}
      >
        <Col sm="10">
          <div className="message-creator">{name}</div>
          <div className="message">{message}</div>
        </Col>
        <Col className="del-button" sm="2">
          {(()=>{
            if (this.state.showDelButton) {
              return (
                <Button
                  outline
                  color="danger"
                  size="sm"
                  style={{marginLeft: '5px'}}
                  className="fa fa-times"
                  onClick={this.deleteMessage.bind(this)}
                  >
                  </Button>
                )
              }
          })()}
        </Col>
      </Row>
    )
  }
}

export default Message;
