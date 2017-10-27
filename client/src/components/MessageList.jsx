import React, { Component } from 'react';
import { Button } from 'reactstrap';

class MessageList extends Component {
  render() {
    return (
      <div className="message-list">
        <div className="container-fluid">
          <div className="message-item row">
            <div className="col-md-10">Антон Ковтун завершил задачу "МТС ЛП ошибка" <span>26 октября 2017 г. 19:41</span></div>
            <div className="col-md-2">
              <Button
                outline
                color="danger"
                size="sm"
                style={{marginLeft: '5px'}}
                className="fa fa-times"
              >
              </Button>
            </div>
          </div>
          <div className="message-item row">
            <div className="col-md-10">Сергей Момот завершил задачу "Билайн Видео" <span>26 октября 2017 г. 19:41</span></div>
            <div className="col-md-2">
              <Button
                outline
                color="danger"
                size="sm"
                style={{marginLeft: '5px'}}
                className="fa fa-times"
              >
              </Button>
            </div>
          </div>
          <div className="message-item row">
            <div className="col-md-10">Антон Ковтун завершил задачу "МТС Музыка" <span>26 октября 2017 г. 19:41</span></div>
            <div className="col-md-2">
              <Button
                outline
                color="danger"
                size="sm"
                style={{marginLeft: '5px'}}
                className="fa fa-times"
              >
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default MessageList;
