import { EVENT_TYPE } from '@/helpers/constants/notification';
import { EventType } from '@notifee/react-native';

const isNutUpdateEventType = (eventType) => {
  return [
    EVENT_TYPE.NUT_CREATED,
    EVENT_TYPE.NUT_ASSIGNED_BY_ADMIN,
    EVENT_TYPE.NUT_ASSIGNED_BY_SYSTEM,
    EVENT_TYPE.NUT_STAGE_CHANGED,
    EVENT_TYPE.NUT_UPDATED,
  ].includes(eventType);
};

const isNutImportEventType = (eventType) => {
  return [EVENT_TYPE.NUT_ASSIGNED_BY_CSV_IMPORT].includes(eventType);
};

const isNutCommentEventType = (eventType) => {
  return [
    EVENT_TYPE.COMMENT_ON_FOLLOWING_NUT,
    EVENT_TYPE.COMMENT_ON_ASSIGNED_NUT,
    EVENT_TYPE.COMMENT_REPLIED_ON_NUT,
    EVENT_TYPE.MENTIONED_IN_NUT_COMMENT,
  ].includes(eventType);
};

export const processNotificationEvent = (event, { navigation }) => {
  const eventType = event?.type ?? '';
  const eventData = event?.detail?.notification?.data ?? {};

  const notificationEventType = eventData?.event ?? '';

  if (!notificationEventType || ![EventType.PRESS, EventType.ACTION_PRESS].includes(eventType)) {
    return;
  }

  if (isNutUpdateEventType(notificationEventType)) {
    const nutId = eventData?.nutId ?? '';

    navigation.navigate('NutDetailsScreen', {
      nutId,
    });
  }

  if (isNutImportEventType(notificationEventType)) {
    navigation.navigate('DashboardScreen');
  }

  if (isNutCommentEventType(notificationEventType)) {
    const nutId = eventData?.nutId ?? '';
    const commentId = eventData?.commentId ?? '';

    navigation.navigate('NutDetailsScreen', {
      nutId,
      commentId,
    });
  }
};
