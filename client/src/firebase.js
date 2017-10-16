import * as firebase from 'firebase';

const config = {
  apiKey: "AIzaSyB2Hn5uGzh4oxtR_nNMlHlBOD7mx8CFX8E",
  authDomain: "tasks-fea3a.firebaseapp.com",
  databaseURL: "https://tasks-fea3a.firebaseio.com",
  projectId: "tasks-fea3a",
  storageBucket: "",
  messagingSenderId: "1005663240187"
};


export const firebaseApp = firebase.initializeApp(config);
export const userListRef = firebase.database().ref('userList');
export const goalRef = firebase.database().ref('goals');
export const completeGoalRef = firebase.database().ref('completeGoals');
