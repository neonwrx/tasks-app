import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import user from './reducer_user';
import goals from './reducer_goals';
import task from './reducer_goal';
import completeGoals from './reducer_completed_goals';
import userTasks from './reducer_usertasks';
import users from './reducer_users';
import notification from './reducer_notification';
import messages from './reducer_messages';

export default combineReducers({
  router: routerReducer,
  user,
  goals,
  task,
  completeGoals,
  userTasks,
  users,
  notification,
  messages
});
