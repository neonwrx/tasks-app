import { SET_USER_TASK } from '../constants';

export default (state = [], action) => {
  switch(action.type) {
    case SET_USER_TASK:
      const { userTasks } = action;
      return userTasks;
    default:
      return state;
  }
}
