import { Device } from '@/helpers/device';
import { store } from '@/store';
import { logoutUser } from '@/store/features/authentication';
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import axios from 'axios';
import { Alert, Platform } from 'react-native';
import Config from 'react-native-config';

const API_URL = Config.API_URL;

const isIosGreaterThan17 = Device.isIOS() && parseInt(Platform.Version, 10) >= 17;

export const makeFormData = (object) => {
  const formData = new FormData();
  Object.keys(object).forEach((key) => formData.append(key, object?.[key] ?? ''));
  return formData;
};

const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  prepareHeaders: (headers, { getState }) => {
    // If we have a token, we need to set the Authorization header
    const token = getState()?.auth?.token ?? '';

    if (token?.length > 0) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    if (Device.isIOS()) {
      headers.set('App-Device-OS', 'ios');
    } else if (Device.isAndroid()) {
      headers.set('App-Device-OS', 'android');
    }

    const user = getState()?.auth?.user ?? {};
    const orgId = user?.orgId ?? '';

    // If we have an orgId, we need to set the cookie header
    if (orgId) {
      headers.append('Cookie', `;orgId=${orgId}`);
    }

    return headers;
  },
});

export const baseQueryWithReAuth = async (args, api, extraOptions) => {
  const state = api.getState();

  if (!state.auth.isLoggedIn) {
    return {
      error: {
        message: 'User is not logged in',
        originalStatus: 401,
      },
    };
  }

  let result = await baseQuery(args, api, extraOptions);

  if (parseInt(result?.error?.originalStatus, 10) === 401) {
    await api.dispatch(logoutUser());
    Alert.alert('Your login has expired!', 'Please login again!', [
      {
        text: 'OK',
        onPress: () => {},
      },
    ]);
  }
  return result;
};

class WebApiClient {
  client;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      timeout: 15000,
      ...(isIosGreaterThan17
        ? {
            paramsSerializer: (params) => {
              let searchParams = '';
              for (const key in params) {
                if (params[key] !== null && params[key] !== undefined) {
                  searchParams += `${key}=${params[key]}&`;
                }
              }
              return searchParams;
            },
          }
        : {}),
      headers: {
        'Content-Type': 'application/json',
        Authorization: '',
      },
    });
  }

  injectRequiredHeaders() {
    const token = store.getState()?.auth?.token ?? '';

    if (token?.length > 0) {
      this.client.defaults.headers.Authorization = `Bearer ${token}`;
    }

    if (Device.isIOS()) {
      this.client.defaults.headers['App-Device-OS'] = 'ios';
    } else if (Device.isAndroid()) {
      this.client.defaults.headers['App-Device-OS'] = 'android';
    }
  }

  get(url, config) {
    this.injectRequiredHeaders();
    return this.client.get(url, config);
  }

  post(url, data, config) {
    this.injectRequiredHeaders();
    return this.client.post(url, data, config);
  }

  put(url, data, config) {
    this.injectRequiredHeaders();
    return this.client.put(url, data, config);
  }

  delete(url, config) {
    this.injectRequiredHeaders();
    return this.client.delete(url, config);
  }

  patch(url, data, config) {
    this.injectRequiredHeaders();
    return this.client.patch(url, data, config);
  }

  request(config) {
    this.injectRequiredHeaders();
    return this.client.request(config);
  }
}

export const webApiClient = new WebApiClient();
