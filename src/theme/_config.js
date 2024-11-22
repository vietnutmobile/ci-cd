import { DarkTheme } from '@react-navigation/native';
import { colors } from '@/theme/colors';

const generateSizes = (start, end, distance) => {
  const sizes = [];
  for (let i = start; i <= end; i += distance) {
    sizes.push(i);
  }
  return sizes;
};

const colorsLight = colors;

const colorsDark = colors;

const fontSizes = [8, 10, 11, 12, 13, 14, 15, 16, 18, 20, 22, 24, 28, 32, 36, 40];

const gutterSizes = generateSizes(0, 120, 2);

const dimensionSizes = [
  ...generateSizes(0, 40, 2),
  60,
  72,
  80,
  100,
  120,
  140,
  160,
  180,
  200,
  220,
  240,
  260,
  280,
  300,
  320,
  360,
];

export const config = {
  colors: colorsLight,
  fonts: {
    sizes: fontSizes,
    colors: colorsLight,
  },
  gutters: gutterSizes,
  dimensions: dimensionSizes,
  backgrounds: colorsLight,
  borders: {
    widths: generateSizes(1, 10, 1),
    radius: generateSizes(2, 20, 2),
    colors: colorsLight,
  },
  navigationColors: {
    ...DarkTheme.colors,
    background: colorsLight.gray50,
    card: colorsLight.gray50,
  },
  variants: {
    dark: {
      colors: colorsDark,
      fonts: {
        colors: colorsDark,
      },
      backgrounds: colorsDark,
      navigationColors: {
        ...DarkTheme.colors,
        background: colorsDark.purple50,
        card: colorsDark.purple50,
      },
    },
  },
};

export const nativeBaseConfig = {
  colors: config.colors,
  config: {
    initialColorMode: 'light',
  },
  components: {
    Input: {
      baseStyle: {
        backgroundColor: colors.white,
        _focus: {
          borderColor: colors.green600,
          backgroundColor: colors.green50,
        },
      },
      defaultProps: {},
      sizes: {},
    },
    Button: {
      baseStyle: {
        _disabled: {
          opacity: '0.65',
        },
      },
    },
  },
};
