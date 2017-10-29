import React from 'react';
import ReactDOM from 'react-dom';

import { createStore } from 'redux';
import { Provider } from 'react-redux';

import createHistory from 'history/createBrowserHistory';
import { Route } from 'react-router';

import { ConnectedRouter } from 'react-router-redux';

import { firebaseApp, userListRef } from './firebase';
import { logUser } from './actions';
import reducer from './reducers';

import App from './components/App';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Cabinet from './components/Cabinet';
import Task from './components/Task';
import CompleteTask from './components/CompleteTask';
import TasksList from './components/TasksList';
import CompleteGoalList from './components/CompleteGoalList';

import './styles/App.css';

// const store = createStore(reducer, applyMiddleware(middleware));
const store = createStore(
  reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
const history = createHistory();
// const middleware = routerMiddleware(history);

firebaseApp.auth().onAuthStateChanged(user => {
  if (user) {
    // console.log('user has signed in or up', user);
    const { email } = user;
    const logEmail = email;

    userListRef.on('value', snap => {
      let currentUser = {};
      snap.forEach(usr => {
        const { email, name, avatar, rights, userMessage, unreadMessage } = usr.val();
        const serverKey = usr.key;
        if (email === logEmail) {
          // console.log('test', logEmail);
          currentUser.email = email;
          currentUser.name = name;
          currentUser.avatar = avatar;
          currentUser.rights = rights;
          currentUser.userMessage = userMessage;
          currentUser.unreadMessage = unreadMessage;
          currentUser.serverKey = serverKey;
        }
      });
      store.dispatch(logUser(currentUser));
    });

    if ((!history.location.pathname.includes('tasks')) && (!history.location.pathname.includes('cabinet'))) {
      history.push('/app');
    }
  } else {
    // console.log('user has signed out or still needs to sign in.');
    history.replace('/signin');
  }
});

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <div>
        <Route exact path="/app" component={App} />
        <Route path="/signin" component={SignIn} />
        <Route path="/signup" component={SignUp} />
        <Route path="/cabinet" component={Cabinet} />
        <Route path="/mytaskslist" component={TasksList} />
        <Route path="/completedtasks" component={CompleteGoalList} />
        <Route path="/tasks/:id" component={Task} />
        <Route path="/completetasks/:id" component={CompleteTask} />
      </div>
    </ConnectedRouter>
  </Provider>, document.getElementById('root')
)
