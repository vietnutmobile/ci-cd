import {GoogleSignin as GoogleSignIn} from '@react-native-google-signin/google-signin';
import Config from 'react-native-config';

// https://github.com/react-native-google-signin/google-signin/issues/1192#issuecomment-1670369305|
GoogleSignIn.configure({
  webClientId: Config.FIREBASE_AUTH_CLIENT_ID,
});

export {GoogleSignIn};
