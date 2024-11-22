import { config } from '@/theme/_config';

export const generateFontColors = (configuration) => {
  return Object.entries(configuration.fonts.colors ?? {}).reduce((acc, [key, value]) => {
    return Object.assign(acc, {
      [`${key}`]: {
        color: value,
      },
    });
  }, {});
};

export const generateFontSizes = () => {
  return config.fonts.sizes.reduce((acc, size) => {
    return Object.assign(acc, {
      [`size_${size}`]: {
        fontSize: size,
      },
      [`line_${size}`]: {
        lineHeight: size,
      },
      [`size_${size}_100`]: {
        fontSize: size,
        lineHeight: size,
      },
      [`size_${size}_120`]: {
        fontSize: size,
        lineHeight: size * 1.2,
      },
      [`size_${size}_150`]: {
        fontSize: size,
        lineHeight: size * 1.5,
      },
      [`size_${size}_160`]: {
        fontSize: size,
        lineHeight: size * 1.6,
      },
      [`size_${size}_180`]: {
        fontSize: size,
        lineHeight: size * 1.8,
      },
    });
  }, {});
};

export const staticFontStyles = {
  light: {
    fontWeight: '300',
  },
  normal: {
    fontWeight: '400',
  },
  medium: {
    fontWeight: '500',
  },
  semi: {
    fontWeight: '600',
  },
  bold: {
    fontWeight: '700',
  },
  extraBold: {
    fontWeight: '800',
  },
  black: {
    fontWeight: '900',
  },
  uppercase: {
    textTransform: 'uppercase',
  },
  capitalize: {
    textTransform: 'capitalize',
  },
  italic: {
    fontStyle: 'italic',
  },
  center: {
    textAlign: 'center',
  },
  left: {
    textAlign: 'left',
  },
  right: {
    textAlign: 'right',
  },
  justify: {
    textAlign: 'justify',
  },
  interThin: {
    fontFamily: 'Inter-Thin',
    fontWeight: '100',
  },
  interLight: {
    fontFamily: 'Inter-Light',
    fontWeight: '300',
  },
  interRegular: {
    fontFamily: 'Inter-Regular',
    fontWeight: '400',
  },
  interMedium: {
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
  },
  interSemiBold: {
    fontFamily: 'Inter-SemiBold',
    fontWeight: '600',
  },
  interBold: {
    fontFamily: 'Inter-Bold',
    fontWeight: '700',
  },
  interExtraBold: {
    fontFamily: 'Inter-ExtraBold',
    fontWeight: '800',
  },
  interBlack: {
    fontFamily: 'Inter-Black',
    fontWeight: '900',
  },
  overflowEllipsis: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
};
