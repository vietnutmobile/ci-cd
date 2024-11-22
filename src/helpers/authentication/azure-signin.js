import { authorize } from 'react-native-app-auth';
import Config from 'react-native-config';

const config = {
  clientId: Config.ENTRA_CLIENT_ID,
  redirectUrl: `${Config.PRODUCT_BUNDLE_IDENTIFIER}://oauth/callback/`,
  scopes: ['openid', 'profile', 'email', 'offline_access'],
  additionalParameters: { prompt: 'consent' },
  serviceConfiguration: {
    authorizationEndpoint: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
    tokenEndpoint: `https://login.microsoftonline.com/common/oauth2/v2.0/token`,
  },
};

const signIn = async () => authorize(config);

export const AzureSignIn = {
  config,
  signIn,
};
