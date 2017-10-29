import { SET_MESSAGES } from '../constants';

export default (state = [], action) => {
  switch(action.type) {
    case SET_MESSAGES:
      const { messages } = action;
      return messages;
    default:
      return state;
  }
}
