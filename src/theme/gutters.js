import { config } from '@/theme/_config';

export const generateGutters = () => {
  return config.gutters.reduce((acc, curr) => {
    return Object.assign(acc, {
      [`top_${curr}`]: {
        top: curr,
      },
      [`bottom_${curr}`]: {
        bottom: curr,
      },
      [`right_${curr}`]: {
        right: curr,
      },
      [`left_${curr}`]: {
        left: curr,
      },
      [`margin_${curr}`]: {
        margin: curr,
      },
      [`marginB_${curr}`]: {
        marginBottom: curr,
      },
      [`marginT_${curr}`]: {
        marginTop: curr,
      },
      [`marginR_${curr}`]: {
        marginRight: curr,
      },
      [`marginL_${curr}`]: {
        marginLeft: curr,
      },
      [`marginV_${curr}`]: {
        marginVertical: curr,
      },
      [`marginH_${curr}`]: {
        marginHorizontal: curr,
      },
      [`padding_${curr}`]: {
        padding: curr,
      },
      [`paddingB_${curr}`]: {
        paddingBottom: curr,
      },
      [`paddingT_${curr}`]: {
        paddingTop: curr,
      },
      [`paddingR_${curr}`]: {
        paddingRight: curr,
      },
      [`paddingL_${curr}`]: {
        paddingLeft: curr,
      },
      [`paddingV_${curr}`]: {
        paddingVertical: curr,
      },
      [`paddingH_${curr}`]: {
        paddingHorizontal: curr,
      },
    });
  }, {});
};

export const staticGutterStyles = {};
