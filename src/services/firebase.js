import * as firebase from 'firebase/app';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBlm1FBKC9hSvBitq8uDLQQV_z9-_TJ1PM",
  authDomain: "fisicapp-3b132.firebaseapp.com",
  databaseURL: "https://fisicapp-3b132.firebaseio.com",
  projectId: "fisicapp-3b132",
  storageBucket: "fisicapp-3b132.appspot.com",
  messagingSenderId: "822054175385",
  appId: "1:822054175385:web:d0e3709cb332d12ebd2e08"
};

firebase.initializeApp(firebaseConfig);

export default firebase;