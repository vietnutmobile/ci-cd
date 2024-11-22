import { config } from '@/theme/_config';

/**
 * Generates border color styles from configuration
 * @param configuration
 */
export const generateBorderColors = (configuration) => {
  return Object.entries(configuration.borders.colors ?? {}).reduce(
    (acc, [key, value]) => {
      return Object.assign(acc, {
        [`color_${key}`]: {
          borderColor: value,
        },
      });
    },
    {},
  );
};
/**
 * Generates border radius styles from configuration
 */
export const generateBorderRadius = () => {
  return config.borders.radius.reduce((acc, radius) => {
    return Object.assign(acc, {
      [`rounded_${radius}`]: {
        borderRadius: radius,
      },
      [`roundedT_${radius}`]: {
        borderTopLeftRadius: radius,
        borderTopRightRadius: radius,
      },
      [`roundedB_${radius}`]: {
        borderBottomLeftRadius: radius,
        borderBottomRightRadius: radius,
      },
      [`roundedL_${radius}`]: {
        borderTopLeftRadius: radius,
        borderBottomLeftRadius: radius,
      },
      [`roundedR_${radius}`]: {
        borderTopRightRadius: radius,
        borderBottomRightRadius: radius,
      },
    });
  }, {});
};
/**
 * Generates border width styles from configuration
 */
export const generateBorderWidths = () => {
  return config.borders.widths.reduce((acc, width) => {
    return Object.assign(acc, {
      [`_${width}`]: {
        borderWidth: width,
      },
      [`top_${width}`]: {
        borderTopWidth: width,
      },
      [`bottom_${width}`]: {
        borderBottomWidth: width,
      },
      [`left_${width}`]: {
        borderLeftWidth: width,
      },
      [`right_${width}`]: {
        borderRightWidth: width,
      },
    });
  }, {});
};
/**
 * Static border styles
 * @desc These styles are not generated from configuration, you can add your own
 */
export const staticBorderStyles = {};
