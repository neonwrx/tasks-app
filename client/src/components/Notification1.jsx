import React, { Component } from 'react';
// import {NotificationContainer, NotificationManager} from 'react-notifications';
import Notification  from 'react-web-notification/lib/components/Notification';

// import 'react-notifications/lib/notifications.css';
// const io = require('socket.io-client');
// const socket = io();

class Notification1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ignore: true,
      title: '',
    };
    this.handleButtonClick = this.handleButtonClick.bind(this);
  }

  // createNotification = (type) => {
  //   return () => {
  //     switch (type) {
  //       case 'info':
  //         NotificationManager.info('Info message');
  //         break;
  //       case 'success':
  //         NotificationManager.success('Success message', 'Title here');
  //         break;
  //       case 'warning':
  //         NotificationManager.warning('Warning message', 'Close after 3000ms', 3000);
  //         break;
  //       case 'error':
  //         NotificationManager.error('Error message', 'Click me!', 5000, () => {
  //           alert('callback');
  //         });
  //         break;
  //     }
  //   };
  // }

  handlePermissionGranted(){
    // console.log('Permission Granted');
    this.setState({
      ignore: false
    });
  }
  handlePermissionDenied(){
    console.log('Permission Denied');
    this.setState({
      ignore: true
    });
  }
  handleNotSupported(){
    console.log('Web Notification not Supported');
    this.setState({
      ignore: true
    });
  }

  handleNotificationOnClick(e, tag){
    console.log(e, 'Notification clicked tag:' + tag);
  }

  handleNotificationOnError(e, tag){
    console.log(e, 'Notification error tag:' + tag);
  }

  handleNotificationOnClose(e, tag){
    console.log(e, 'Notification closed tag:' + tag);
  }

  handleNotificationOnShow(e, tag){
    // this.playSound();
    console.log(e, 'Notification shown tag:' + tag);
  }

  // playSound(filename){
  //   document.getElementById('sound').play();
  // }

  handleButtonClick() {

    if(this.state.ignore) {
      return;
    }

    const now = Date.now();

    const title = 'Задача выполнена';
    // const body = 'Hello' + new Date();
    const tag = now;
    // const icon = 'http://georgeosddev.github.io/react-web-notification/example/Notifications_button_24.png';
    // const icon = 'http://localhost:3000/Notifications_button_24.png';

    // Available options
    // See https://developer.mozilla.org/en-US/docs/Web/API/Notification/Notification
    const options = {
      tag: tag,
      // body: body,
      // icon: icon,
      lang: 'en',
      dir: 'ltr',
      // renotify: true,
      requireInteraction: true
      // sound: './sound.mp3'  // no browsers supported https://developer.mozilla.org/en/docs/Web/API/notification/sound#Browser_compatibility
    }
    this.setState({
      title: title,
      options: options
    });
    // console.log('ggghh');
    // socket.emit('notification', {title: 'Hello nigga'})
  }

  render() {
    return (
      <div>
        {/* <button className='btn btn-info'
          onClick={this.createNotification('info')}>Info
        </button>
        <hr/>
        <button className='btn btn-success'
          onClick={this.createNotification('success')}>Success
        </button>
        <hr/>
        <button className='btn btn-warning'
          onClick={this.createNotification('warning')}>Warning
        </button>
        <hr/>
        <button className='btn btn-danger'
          onClick={this.createNotification('error')}>Error
        </button>

        <NotificationContainer/>
        <br/> */}

        {/* <button onClick={this.handleButtonClick.bind(this)}>Уведомление</button> */}
        <Notification
          ignore={this.state.ignore && this.state.title !== ''}
          notSupported={this.handleNotSupported.bind(this)}
          onPermissionGranted={this.handlePermissionGranted.bind(this)}
          onPermissionDenied={this.handlePermissionDenied.bind(this)}
          // onShow={this.handleNotificationOnShow.bind(this)}
          // onClick={this.handleNotificationOnClick.bind(this)}
          // onClose={this.handleNotificationOnClose.bind(this)}
          // onError={this.handleNotificationOnError.bind(this)}
          // timeout={10000}
          title={this.state.title}
          options={this.state.options}
        />
      </div>
    );
  }
}

export default Notification1;
