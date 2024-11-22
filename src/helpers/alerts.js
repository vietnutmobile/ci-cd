import { Alert } from 'react-native';

export const showSimpleAlert = (title, message) => {
  Alert.alert(title, message, [{ text: 'OK', onPress: () => {} }]);
};
