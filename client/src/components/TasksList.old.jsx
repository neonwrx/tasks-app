import React, { Component } from 'react';
import {connect } from 'react-redux';
import { setUserTask } from '../actions';
import { userListRef } from '../firebase';

class TasksList extends Component {
  componentDidMount() {
    userListRef.on('value', snap => {
      let userTasks = [];
      snap.forEach(userTask => {
        const { email, tasks } = userTask.val();
        userTasks.push({email, tasks});
        console.log('prob', userTask.val());
      })
      this.props.setUserTask(userTasks);
    })
  }

  render() {
    console.log('this.props.userTasks', this.props.userTasks);
    const { name, email } = this.props.user;
    const userEmail = email;
    return (
      <div>
        <h4>
          List of tasks for <span><em>{ name }</em></span><span> ({ email })</span>
        </h4>
        {
          this.props.userTasks.map((userTask, index) => {
            const { tasks, email } = userTask;
            // console.log('test', tasks.title);
            // if ( email === userEmail ) {
            //   // console.log('tasks', Object.entries(tasks));
            //   Object.entries(tasks).map((task, index) => {
            //     // const { title } = task;
            //     console.log('task', task['title']);
            //
            //   })
            //   // for(var key in tasks) {
            //     // console.log('tasks', tasks[key].title);
            //     // return (
            //     //   <div key={index}>
            //     //     {
            //     //       tasks[key].title
            //     //     }
            //     //   </div>
            //     // )
            //   // }
            // }
            return (
              <div key={index}>
                <strong>
                  {

                  }
                </strong> completed by <em>{email}</em>
              </div>
            )
          })
        }
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { userTasks, user } = state;
  return  {
    userTasks,
    user
  }
}

export default connect(mapStateToProps, { setUserTask })(TasksList);
