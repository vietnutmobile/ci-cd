import 'react-native-gesture-handler';
import ApplicationNavigator from '@/navigators';
import { persistor, storage, store } from '@/store';
import '@/translations';
import { ThemeProvider } from '@/theme';
import { nativeBaseConfig } from '@/theme/_config';
import { extendTheme, NativeBaseProvider } from 'native-base';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

function App() {
  const theme = extendTheme(nativeBaseConfig);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider storage={storage}>
          <NativeBaseProvider theme={theme}>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <ApplicationNavigator />
            </GestureHandlerRootView>
          </NativeBaseProvider>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
