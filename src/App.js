import 'react-native-gesture-handler';
import ApplicationNavigator from '@/navigators';
import {persistor, storage, store} from '@/store';
import '@/translations';
import {ThemeProvider} from '@/theme';
import {nativeBaseConfig} from '@/theme/_config';
import {extendTheme, NativeBaseProvider} from 'native-base';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {useEffect} from 'react';
import BootSplash from 'react-native-bootsplash';

function App() {
  const theme = extendTheme(nativeBaseConfig);

  useEffect(() => {
    BootSplash.hide();
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider storage={storage}>
          <NativeBaseProvider theme={theme}>
            <ApplicationNavigator />
          </NativeBaseProvider>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
