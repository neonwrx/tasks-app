import { REGISTERED_USERS } from '../constants';

export default (state = [], action) => {
  switch (action.type) {
    case REGISTERED_USERS:
      const { users } = action;
      return users;
    default:
      return state;
  }
}
