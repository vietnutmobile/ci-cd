import { config } from '@/theme/_config';
import { Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export const generateDimensions = () => {
  return config.dimensions.reduce((acc, curr) => {
    return Object.assign(acc, {
      [`square_${curr}`]: {
        width: curr,
        height: curr,
      },
      [`width_${curr}`]: {
        width: curr,
      },
      [`height_${curr}`]: {
        height: curr,
      },
      [`maxHeight_${curr}`]: {
        maxHeight: curr,
      },
      [`maxWidth_${curr}`]: {
        maxWidth: curr,
      },
      [`minHeight_${curr}`]: {
        minHeight: curr,
      },
      [`minWidth_${curr}`]: {
        minWidth: curr,
      },
    });
  }, {});
};

export const staticDimensionStyles = {
  fullWidth: {
    width: '100%',
  },
  fullHeight: {
    height: '100%',
  },
  windowWidth: {
    width: windowWidth,
  },
  windowHeight: {
    height: windowHeight,
  },
};
