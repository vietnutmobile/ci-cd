import { useNavigation } from '@react-navigation/native';

const useNavigator = () => {
  const navigation = useNavigation();

  return {
    navigate: navigation.navigate,
    back: (...params) => {
      if (params?.length > 0) {
      } else {
        navigation.goBack();
      }
    },
    push: navigation.push,
    pop: navigation.pop,
    popToTop: navigation.popToTop,
    replace: navigation.replace,
    reset: navigation.reset,
    setParams: navigation.setParams,
  };
};

export default useNavigator;
