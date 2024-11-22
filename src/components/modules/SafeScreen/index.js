import { useTheme } from '@/theme';
import { KeyboardAvoidingView, Platform, SafeAreaView, StatusBar, View } from 'react-native';

const isIOS = Platform.OS === 'ios';

function SafeScreen({ children, safeAreaBottom = true, ...props }) {
  const { layout, variant, gutters, navigationTheme } = useTheme();

  return (
    <SafeAreaView style={[layout.flex_1, safeAreaBottom && gutters.marginB_12]}>
      <KeyboardAvoidingView
        style={[layout.flex_1]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <StatusBar
          barStyle={variant === 'dark' ? 'light-content' : 'dark-content'}
          backgroundColor={navigationTheme.colors.background}
        />
        <View style={[layout.flex_1, gutters.paddingH_12, props.style]}>{children}</View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default SafeScreen;
