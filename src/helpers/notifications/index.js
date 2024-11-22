import { Device, htmlToPlainText } from '@/helpers';
import useNavigator from '@/helpers/hooks/use-navigation';
import { processNotificationEvent } from '@/helpers/notifications/process-notification-events';
import notifee, {
  AndroidBadgeIconType,
  AndroidImportance,
  AuthorizationStatus,
  EventType,
} from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import { useEffect, useRef } from 'react';
import NotificationSounds from 'react-native-notification-sounds';
import sanitizeHtml from 'sanitize-html';

const ANDROID_CHANNEL_ID = 'default';
const ANDROID_CHANNEL_NAME = 'Default Channel';
const ANDROID_ICON_NAME = 'ic_notification';

export const requestNewFcmToken = async () => {
  if (!messaging().isDeviceRegisteredForRemoteMessages) {
    await messaging().registerDeviceForRemoteMessages();
  }
  await messaging().deleteToken();
  return messaging().getToken();
};

const requestUserPermission = async () => {
  const settings = await notifee.requestPermission({
    criticalAlert: true,
    provisional: true,
  });
  const { authorizationStatus } = settings;

  if (authorizationStatus === AuthorizationStatus.DENIED) {
    console.log('User denied permissions request');
  } else if (authorizationStatus === AuthorizationStatus.AUTHORIZED) {
    console.log('User granted permissions request');
  } else if (authorizationStatus === AuthorizationStatus.PROVISIONAL) {
    console.log('User provisionally granted permissions request');
  }

  return (
    authorizationStatus === AuthorizationStatus.AUTHORIZED ||
    authorizationStatus === AuthorizationStatus.PROVISIONAL
  );
};

const setupAndroidNotificationChannels = async () => {
  const soundsList = await NotificationSounds.getNotifications('notification');

  await notifee.createChannel({
    id: ANDROID_CHANNEL_ID,
    name: ANDROID_CHANNEL_NAME,
    importance: AndroidImportance.HIGH,
    vibration: true,
    vibrationPattern: [300, 500],
    sound: soundsList?.[0]?.url ?? 'default',
  });
};

const displayNotification = async (remoteMessage) => {
  const { data } = remoteMessage;
  const { title, body } = data || {};

  let parsedBody = htmlToPlainText(body);

  if (Device.isAndroid()) {
    parsedBody = sanitizeHtml(body, {
      allowedTags: ['b', 'i', 'em', 'strong', 'u', 's', 'span', 'br', 'a'],
      allowedAttributes: {},
    });
  }

  await notifee.displayNotification({
    title,
    body: parsedBody,
    data,
    android: {
      badgeIconType: AndroidBadgeIconType.LARGE,
      channelId: ANDROID_CHANNEL_ID,
      smallIcon: ANDROID_ICON_NAME,
      color: '#f3fff8',
      colorized: true,
      pressAction: {
        id: 'default',
      },
    },
    ios: {
      critical: true,
      interruptionLevel: 'timeSensitive',
      sound: 'default',
      foregroundPresentationOptions: {
        badge: true,
        sound: true,
        banner: true,
        list: true,
      },
    },
  });
};

const logEvent = (event) => {
  // if not development return;
  if (!__DEV__) return;

  const { type, detail } = event;

  if (!type || !detail) return;

  if (type === EventType.ACTION_PRESS) {
    console.log('Action Press', JSON.stringify(event, null, 2));
  } else if (type === EventType.APP_BLOCKED) {
    console.log('App Blocked', JSON.stringify(detail, null, 2));
  } else if (type === EventType.CHANNEL_BLOCKED) {
    console.log('Channel Blocked', JSON.stringify(detail, null, 2));
  } else if (type === EventType.CHANNEL_GROUP_BLOCKED) {
    console.log('Channel Group Blocked', JSON.stringify(detail, null, 2));
  } else if (type === EventType.DELIVERED) {
    console.log('Delivered', JSON.stringify(detail, null, 2));
  } else if (type === EventType.DISMISSED) {
    console.log('Dismissed', JSON.stringify(detail, null, 2));
  } else if (type === EventType.PRESS) {
    console.log('Press', JSON.stringify(detail, null, 2));
  } else if (type === EventType.TRIGGER_NOTIFICATION_CREATED) {
    console.log('Trigger Notification Created', JSON.stringify(detail, null, 2));
  }
};

const setupNotificationForPlatforms = async (helpers) => {
  const { navigation, setFcmToken } = helpers;

  await messaging().setAutoInitEnabled(true);

  // iOS Only
  await requestUserPermission();
  // Android Only
  await setupAndroidNotificationChannels();

  // Handle token refresh: https://rnfirebase.io/reference/messaging#onTokenRefresh
  messaging().onTokenRefresh(async (fcmToken) => {
    setFcmToken(fcmToken);
  });

  const unsubscribeOpenAppEvent = messaging().onNotificationOpenedApp(async (remoteMessage) => {
    console.log(
      'Notification caused app to open from background state:',
      JSON.stringify(remoteMessage, null, 2),
    );
  });

  // Handle message from cloud at foreground: https://notifee.app/react-native/docs/events#foreground-events
  const unsubscribeMessaging = messaging().onMessage(async (remoteMessage) => {
    await displayNotification(remoteMessage);
  });

  // Handle message from cloud at background: https://notifee.app/react-native/docs/events#background-events
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    await displayNotification(remoteMessage);
  });

  // Handle notification events in the foreground: delivered, user press, dismiss, etc.
  const unsubscribeNotifeeForegroundEvent = notifee.onForegroundEvent((event) => {
    logEvent(event);
    processNotificationEvent(event, {
      navigation,
    });
  });

  // Handle notification events in the background: delivered, user press, dismiss, etc.
  notifee.onBackgroundEvent((event) => {
    logEvent(event);
    processNotificationEvent(event, {
      navigation,
    });
  });

  return () => {
    unsubscribeOpenAppEvent();
    unsubscribeMessaging();
    unsubscribeNotifeeForegroundEvent();
  };
};

const NotificationProvider = ({ userId, fcmToken, setFcmToken }) => {
  const isSetupRef = useRef(false);
  const navigation = useNavigator();

  // Make sure to only setup event handlers once to avoid duplicated notifications
  useEffect(() => {
    let cleanup = () => {};

    if (userId?.length > 0 && fcmToken?.length > 0 && !isSetupRef.current) {
      const setupNotifications = async () => {
        cleanup = await setupNotificationForPlatforms({
          navigation,
          setFcmToken,
        });
        isSetupRef.current = true;
      };
      setupNotifications();
    }

    if (typeof cleanup === 'function') {
      return () => cleanup();
    }
  }, [userId, fcmToken]);

  return <></>;
};

export default NotificationProvider;
