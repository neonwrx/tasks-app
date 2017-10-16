import { SET_GOAL } from '../constants';

export default (state = [], action) => {
  switch(action.type) {
    case SET_GOAL:
      const { task } = action;
      return task;
    default:
      return state;
  }
}
