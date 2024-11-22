import memoize from 'lodash.memoize';
import { Platform } from 'react-native';

const isIOS = memoize(() => Platform.OS === 'ios');
const isAndroid = memoize(() => Platform.OS === 'android');

export const Device = {
  isIOS,
  isAndroid,
};
