import React, { Component } from 'react';
import { connect } from 'react-redux';
import Header from './Header';
import { Input, Button } from 'reactstrap';
import { setGoals, setCompleted } from '../actions';
import { userListRef, goalRef, completeGoalRef } from '../firebase';
import moment from 'moment';
import 'moment/locale/ru';
import '../styles/Cabinet.css';

class Cabinet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      todayString: moment(new Date()).format('DD MMMM YYYY'),
      totalUserTasks: 0,
      todayUserTasks: 0,
      message: ''
    }
  }

  componentDidMount() {
    let totalUserTasks = 0;
    let todayUserTasks = 0;
    userListRef.on('value', snap => {
      snap.forEach(goal => {
        const { name } = goal.val();
        const serverKey = goal.key;
        if (serverKey === this.props.user.serverKey) {
          this.setState({ name: name });
        }
      })
    });
    goalRef.on('value', snap => {
      let goals = [];
      snap.forEach(goal => {
        const { creator, title, assigned, description, status, attached, message, created, finished, priority, category } = goal.val();
        const serverKey = goal.key;
        goals.push({ creator, title, assigned, description, status, attached, message, created, finished, priority, category, serverKey });
      })
      this.props.setGoals(goals);
      totalUserTasks = totalUserTasks + (this.props.goals.filter(goal => goal.assigned === this.props.user.email)).length;
      todayUserTasks = todayUserTasks + (this.props.goals.filter(goal => goal.assigned === this.props.user.email && goal.finished.match( this.state.todayString))).length;
      this.setState({totalUserTasks: totalUserTasks, todayUserTasks: todayUserTasks});
    });
    completeGoalRef.on('value', snap => {
      let completeGoals = [];
      snap.forEach(completeGoal => {
        const { email, title, assigned, description, status, attached, message, created, finished, category } = completeGoal.val();
        const serverKey = completeGoal.key;
        completeGoals.push({email, title, assigned, description, status, attached, message, created, finished, category, serverKey})
      })
      this.props.setCompleted(completeGoals);
      totalUserTasks = totalUserTasks + (this.props.completeGoals.filter(goal => goal.assigned === this.props.user.email)).length;
      todayUserTasks = todayUserTasks + (this.props.completeGoals.filter(goal => goal.assigned === this.props.user.email && goal.finished.match( this.state.todayString))).length;
      this.setState({totalUserTasks: totalUserTasks, todayUserTasks: todayUserTasks});
    });
  }

  changeName() {
    const { name } = this.state;
    const { serverKey } = this.props.user;
    if (this.input.value) {
      userListRef.child(serverKey).update({name: name});
      this.setState({message: 'Изменения внесены'});
      setTimeout(() => {
        this.setState({
          message: ''
        });
      }, 3000);
    } else {
      this.setState({message: 'Некорректное значение'});
      setTimeout(() => {
        this.setState({
          message: ''
        });
      }, 3000);
    }
  }

  render() {
    const { email, avatar, rights } = this.props.user;
    // console.log(this.props.user);
    return (
      <div>
        <Header />
        <br/>
        <br/>
        <br/>
        <div className="container">
          <div className="wrap">
            <div className="image">
              <img className="avatar-lg" src={require(`../../uploads/avatars/${avatar}`)} alt="" />
            </div>
            <div style={{marginBottom: '5px'}}>Email: {email}</div>
            <div className="form-inline">
              <div className="form-group nulled">
                <span>ФИО: </span>
                <Input
                  style={{marginRight: '5px'}}
                  size="sm"
                  className="form-control"
                  type="text"
                  placeholder="Ваше имя"
                  getRef={(input) => (this.input = input)}
                  // value= {(this.state.name) ? this.state.name : name}
                  value= {this.state.name}
                  onChange={event => this.setState({name: event.target.value})}
                />
                <Button
                  outline
                  className="fa fa-floppy-o"
                  color="secondary"
                  size="sm"
                  style={{marginLeft: '5px'}}
                  onClick={() => this.changeName()}
                >
                </Button>
              </div>
            </div>
            <div className="message">{this.state.message}</div>
            <div>Права доступа: {rights}</div>
            <div>Задач за сегодня: { this.state.todayUserTasks }</div>
            <div>Задач за все время: { this.state.totalUserTasks }</div>
            <br/>
            <div>Создано задач за неделю: </div>
            <div>Создано задач за все время: { this.props.goals.length + this.props.completeGoals.length }</div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { user, goals, completeGoals } = state;
  return {
    user,
    goals,
    completeGoals
  }
}

export default connect(mapStateToProps, { setGoals, setCompleted })(Cabinet);
