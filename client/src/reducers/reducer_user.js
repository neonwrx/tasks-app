import { SIGNED_IN } from '../constants';

// let user = {
//   email: null
// }

export default (state = [], action) => {
  switch (action.type) {
    case SIGNED_IN:
      const { currentUser } = action;
      // user = {
      //   email
      // }
      return currentUser;
    default:
      return state;
  }
}
