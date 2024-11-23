import {GoogleSignin as GoogleSignIn} from '@react-native-google-signin/google-signin';
import Config from 'react-native-config';

console.log('Config', Config.FIREBASE_AUTH_CLIENT_ID);

// https://github.com/react-native-google-signin/google-signin/issues/1192#issuecomment-1670369305|
GoogleSignIn.configure({
  webClientId: '123' || Config.FIREBASE_AUTH_CLIENT_ID,
});

export {GoogleSignIn};
