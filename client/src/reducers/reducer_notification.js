import { SET_NOTIFICATION } from '../constants';

export default (state = [], action) => {
  switch(action.type) {
    case SET_NOTIFICATION:
      return Object.assign({}, state, {
        message: action.message,
        level: action.level
      });
    default:
      return state;
  }
}
