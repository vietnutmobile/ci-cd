import NotificationProvider, { requestNewFcmToken } from '@/helpers/notifications';
import { AuthStack } from '@/navigators/AuthStacks';
import { MainStack } from '@/navigators/MainStacks';
import { useGetUserProfileQuery, useUpdateUserDeviceTokensMutation } from '@/store/services';
import { useTheme } from '@/theme';
import { NavigationContainer } from '@react-navigation/native';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

function ApplicationNavigator() {
  const { navigationTheme } = useTheme();

  const auth = useSelector((state) => state?.auth ?? {});
  const [fcmToken, setFcmToken] = useState('');
  const token = auth?.token ?? '';
  const isAuthenticated = useMemo(() => token?.length > 0, [token]);

  const { data: userData } = useGetUserProfileQuery();
  const [submitDeviceToken] = useUpdateUserDeviceTokensMutation();

  const syncDeviceToken = async () => {
    let deviceFcmToken = '';

    try {
      deviceFcmToken = await requestNewFcmToken();
      console.log('Device token', deviceFcmToken);
    } catch (e) {
      console.error('Error getting device token', e);
    }

    try {
      if (deviceFcmToken) {
        await submitDeviceToken({
          tokens: [deviceFcmToken],
        }).unwrap();
        // console.log('result submitDeviceToken', result);
        setFcmToken(deviceFcmToken);
      }
    } catch (e) {
      console.error('Error submitting device token', e);
    }
  };

  useEffect(() => {
    if (auth?.token) {
      syncDeviceToken();
    }
  }, [auth?.token]);

  return (
    <NavigationContainer theme={navigationTheme}>
      {userData?.id && fcmToken && (
        <NotificationProvider userId={userData.id} setFcmToken={setFcmToken} fcmToken={fcmToken} />
      )}
      {isAuthenticated ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

export default ApplicationNavigator;
