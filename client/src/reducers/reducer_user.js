import { SIGNED_IN } from '../constants';

export default (state = [], action) => {
  switch (action.type) {
    case SIGNED_IN:
      const { currentUser } = action;
      return currentUser;
    default:
      return state;
  }
}
