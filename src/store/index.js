import features from '@/store/features';
import { createCurlMiddleware } from '@/store/middlewares';
import { rootApi } from '@/store/services';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { MMKV } from 'react-native-mmkv';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';
import logger from 'redux-logger';

export const storage = new MMKV();

const isDevelopment = process.env.NODE_ENV === 'development';

export const reduxPersistStorage = {
  setItem: (key, value) => {
    storage.set(key, value);
    return Promise.resolve(true);
  },
  getItem: (key) => {
    const value = storage.getString(key);
    return Promise.resolve(value);
  },
  removeItem: (key) => {
    storage.delete(key);
    return Promise.resolve();
  },
};

const persistConfig = {
  key: 'root',
  storage: reduxPersistStorage,
  whitelist: ['auth'],
  blacklist: [rootApi.reducerPath],
};

const rootReducer = combineReducers({
  [rootApi.reducerPath]: rootApi.reducer,
  ...features,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(isDevelopment ? [createCurlMiddleware(), rootApi.middleware] : [rootApi.middleware]),
});

export const persistor = persistStore(store);
