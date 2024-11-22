import Config from 'react-native-config';

const isTestingEnable = Config.TESTING_ENABLED === 'true';

export const testSelector = (testID) =>
  isTestingEnable
    ? {
        accessible: false,
        testID,
      }
    : {};
