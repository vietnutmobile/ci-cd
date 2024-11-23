import {Button, Image, Text} from '@/components/atoms';
import SafeScreen from '@/components/modules/SafeScreen';
import {AzureSignIn, Device} from '@/helpers';
import {showSimpleAlert} from '@/helpers/alerts';
import {GoogleSignIn} from '@/helpers/authentication/google-signin';
import {
  AUTH_PROVIDER_APPLE,
  AUTH_PROVIDER_AZURE,
  AUTH_PROVIDER_GOOGLE,
  SIGN_IN_ERROR_MESSAGE,
  TRY_AGAIN_ERROR_MESSAGE,
} from '@/helpers/constants';
import {fetchAppToken} from '@/store/features/authentication';
import {useTheme} from '@/theme';
import {Images} from '@/theme/ImageProvider';
import {appleAuth} from '@invertase/react-native-apple-authentication';
import {HStack} from 'native-base';
import {useState} from 'react';
import {View} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {useDispatch} from 'react-redux';

function LoginScreen({navigation}) {
  const dispatch = useDispatch();

  const {layout, gutters, backgrounds, dimensions, fonts, colors, borders} =
    useTheme();
  const [loggingInWithGoogle, setLoggingInWithGoogle] = useState(false);
  const [loggingInWithAzure, setLoggingInWithAzure] = useState(false);
  const [loggingInWithApple, setLoggingInWithApple] = useState(false);

  const signInWithGoogle = async () => {
    setLoggingInWithGoogle(true);

    let signInResult;

    try {
      signInResult = await GoogleSignIn.signIn();
    } catch (error) {
      console.log('error', JSON.stringify(error, null, 2));
    }

    if (!signInResult) {
      setLoggingInWithGoogle(false);
      return;
    }

    try {
      const result = await dispatch(
        fetchAppToken({
          ...signInResult,
          provider: AUTH_PROVIDER_GOOGLE,
        }),
      );

      if (fetchAppToken.rejected.match(result)) {
        showSimpleAlert(SIGN_IN_ERROR_MESSAGE, TRY_AGAIN_ERROR_MESSAGE);
      }
    } catch (error) {
      showSimpleAlert(SIGN_IN_ERROR_MESSAGE, TRY_AGAIN_ERROR_MESSAGE);
    } finally {
      setLoggingInWithGoogle(false);
    }
  };

  const signInWithAzure = async () => {
    setLoggingInWithAzure(true);
    let signInResult;

    try {
      signInResult = await AzureSignIn.signIn();
    } catch (error) {
      console.log('error', JSON.stringify(error));
    }

    if (!signInResult) {
      setLoggingInWithAzure(false);
      return;
    }

    try {
      const result = await dispatch(
        fetchAppToken({
          ...signInResult,
          provider: AUTH_PROVIDER_AZURE,
        }),
      );

      if (fetchAppToken.rejected.match(result)) {
        showSimpleAlert(SIGN_IN_ERROR_MESSAGE, TRY_AGAIN_ERROR_MESSAGE);
      }
    } catch (error) {
      console.log('error', JSON.stringify(error));
      showSimpleAlert(SIGN_IN_ERROR_MESSAGE, TRY_AGAIN_ERROR_MESSAGE);
    } finally {
      setLoggingInWithAzure(false);
    }
  };

  const signInWithApple = async () => {
    setLoggingInWithApple(true);
    let signInResult;
    let credentialState;

    try {
      signInResult = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
      });

      credentialState = await appleAuth.getCredentialStateForUser(
        signInResult.user,
      );

      if (credentialState === appleAuth.State.AUTHORIZED) {
        console.log('credentialState', credentialState);
      }
    } catch (error) {
      console.log('error', JSON.stringify(error));
    }

    if (!signInResult || credentialState !== appleAuth.State.AUTHORIZED) {
      setLoggingInWithApple(false);
      return;
    }

    try {
      const result = await dispatch(
        fetchAppToken({
          idToken: signInResult.identityToken,
          accessToken: signInResult.authorizationCode,
          provider: AUTH_PROVIDER_APPLE,
        }),
      );

      if (fetchAppToken.rejected.match(result)) {
        showSimpleAlert(SIGN_IN_ERROR_MESSAGE, TRY_AGAIN_ERROR_MESSAGE);
      }
    } catch (error) {
      showSimpleAlert(SIGN_IN_ERROR_MESSAGE, TRY_AGAIN_ERROR_MESSAGE);
    } finally {
      setLoggingInWithApple(false);
    }
  };

  return (
    <SafeScreen>
      <View style={[layout.flex_1, layout.col, layout.itemsCenter]}>
        <View
          style={[
            layout.flex_1,
            layout.col,
            layout.itemsCenter,
            layout.justifyCenter,
            gutters.paddingB_60,
          ]}>
          <Image
            source={Images.LOGO}
            style={[
              dimensions.width_260,
              gutters.marginB_60,
              {
                height: undefined,
                aspectRatio: '134/30',
              },
            ]}
            resizeMode="contain"
          />

          <HStack space={2}>
            {loggingInWithGoogle && (
              <Images.IC_SPINNER
                width={15}
                height={15}
                color={colors.green600}
                fill={colors.white}
                animatedViewStyle={[
                  layout.absolute,
                  {
                    right: 16,
                    top: 16,
                    zIndex: 1,
                  },
                ]}
              />
            )}

            <Button
              disabled={loggingInWithGoogle}
              isLoading={loggingInWithGoogle}
              px={4}
              py={2.5}
              spinnerPlacement="end"
              onPress={signInWithGoogle}
              isLoadingText={
                <Images.IC_GOOGLE_SIGN_IN width={180} height={22} />
              }
              style={[
                backgrounds.white,
                borders._1,
                borders.roundedFull,
                borders.gray400,
              ]}>
              <Images.IC_GOOGLE_SIGN_IN width={180} height={22} />
            </Button>
          </HStack>

          <HStack space={2} mt={3}>
            {loggingInWithAzure && (
              <Images.IC_SPINNER
                width={15}
                height={15}
                color={colors.green600}
                fill={colors.white}
                animatedViewStyle={[
                  layout.absolute,
                  {
                    right: 16,
                    top: 16,
                    zIndex: 1,
                  },
                ]}
              />
            )}

            <Button
              disabled={loggingInWithAzure}
              isLoading={loggingInWithAzure}
              px={4}
              py={2.5}
              spinnerPlacement="end"
              onPress={signInWithAzure}
              isLoadingText={<Images.IC_MS_SIGN_IN width={180} height={22} />}
              style={[
                backgrounds.white,
                borders._1,
                borders.roundedFull,
                borders.gray400,
              ]}>
              <Images.IC_MS_SIGN_IN width={180} height={22} />
            </Button>
          </HStack>

          {Device.isIOS() && (
            <HStack space={2} mt={3}>
              {loggingInWithApple && (
                <Images.IC_SPINNER
                  width={15}
                  height={15}
                  color={colors.green600}
                  fill={colors.white}
                  animatedViewStyle={[
                    layout.absolute,
                    {
                      right: 16,
                      top: 16,
                      zIndex: 1,
                    },
                  ]}
                />
              )}

              <Button
                disabled={loggingInWithApple}
                isLoading={loggingInWithApple}
                px={4}
                py={2.5}
                spinnerPlacement="end"
                onPress={signInWithApple}
                isLoadingText={
                  <Images.IC_APPLE_SIGN_IN width={180} height={22} />
                }
                style={[
                  backgrounds.white,
                  borders._1,
                  borders.roundedFull,
                  borders.gray400,
                ]}>
                <Images.IC_APPLE_SIGN_IN width={180} height={22} />
              </Button>
            </HStack>
          )}

          <Text style={[gutters.marginT_60, gutters.paddingH_20, fonts.center]}>
            <Text style={[fonts.size_12_150]}>
              By using Nutsales, you agree to our{' '}
            </Text>
            {'\n'}
            <Text
              onPress={() => navigation.navigate('TermsAndConditionsScreen')}
              style={[fonts.size_12_150, fonts.green600]}>
              Terms and Conditions
            </Text>
            <Text style={[fonts.size_12_150]}> and </Text>
            <Text
              onPress={() => navigation.navigate('PrivacyPolicyScreen')}
              style={[fonts.size_12_150, fonts.green600]}>
              Privacy Policy
            </Text>
          </Text>
        </View>

        <Text
          style={[
            layout.absolute,
            gutters.marginT_12,
            fonts.size_11,
            fonts.gray500,
            {
              bottom: 0,
            },
          ]}>
          Version: {DeviceInfo.getVersion()}
        </Text>
      </View>
    </SafeScreen>
  );
}

export default LoginScreen;
