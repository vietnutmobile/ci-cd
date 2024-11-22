import { useTheme } from '@/theme';
import { useToast as useNativeToast } from 'native-base';

// Style toast
// https://github.com/GeekyAnts/NativeBase/issues/840

const useToast = () => {
  const toast = useNativeToast();
  const { layout, gutters, fonts, colors, borders, backgrounds, dimensions } = useTheme();

  return {
    show: (props) => {
      toast.show({
        // style: {
        //   backgroundColor: colors.gray50,
        //   borderRadius: dimensions.radius,
        //   borderWidth: 1,
        //   borderColor: colors.gray200,
        // },
        // textStyle: {
        //   color: colors.green600,
        // },
        avoidKeyboard: true,
        ...props,
      });
    },
  };
};

export default useToast;
