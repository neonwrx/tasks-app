import { SIGNED_IN, SET_GOALS, SET_GOAL, SET_COMPLETED, SET_USER_TASK, REGISTERED_USERS, SET_NOTIFICATION, SET_MESSAGES } from '../constants';

export function logUser(currentUser) {
  const action = {
    type: SIGNED_IN,
    currentUser
  }
  return action;
}

export function setGoals(goals) {
  const action = {
    type: SET_GOALS,
    goals
  }
  return action;
}

export function setGoal(task) {
  const action = {
    type: SET_GOAL,
    task
  }
  return action;
}

export function setCompleted(completeGoals) {
  const action = {
    type: SET_COMPLETED,
    completeGoals
  }
  return action;
}

export function setUserTask(userTasks) {
  const action = {
    type: SET_USER_TASK,
    userTasks
  }
  return action;
}

export function setUsers(users) {
  const action = {
    type: REGISTERED_USERS,
    users
  }
  return action;
}

export function setNotification(message, level) {
  const action = {
    type: SET_NOTIFICATION,
    message,
    level
  }
  return action;
}

export function setMessages(messages) {
  const action = {
    type: SET_MESSAGES,
    messages
  }
  return action;
}
