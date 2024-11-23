import {webApiClient} from '@/helpers';
import {
  AUTH_PROVIDER_APPLE,
  AUTH_PROVIDER_AZURE,
  AUTH_PROVIDER_GOOGLE,
} from '@/helpers/constants';
import {rootApi} from '@/store/services';
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

const initialState = {
  token: '',
  user: {},
  isLoggedIn: false,
};

export const fetchAppToken = createAsyncThunk(
  'auth/fetchAppToken',
  async ({provider, ...tokens}, {rejectWithValue, dispatch}) => {
    await dispatch(rootApi.util.resetApiState());

    if (!provider) {
      return rejectWithValue({
        message: 'No provider provided',
      });
    }

    let result;

    try {
      if (provider === AUTH_PROVIDER_GOOGLE) {
        const response = await webApiClient.post(
          '/api/auth/google/token/verify',
          tokens,
        );
        result = response?.data;
      } else if (provider === AUTH_PROVIDER_AZURE) {
        const response = await webApiClient.post(
          '/api/auth/azure/token/verify',
          tokens,
        );
        result = response?.data;
      } else if (provider === AUTH_PROVIDER_APPLE) {
        const response = await webApiClient.post(
          '/api/auth/apple/token/verify',
          tokens,
        );
        result = response?.data;
      }
      return result;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error?.response?.data);
    }
  },
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, {dispatch}) => {
    await dispatch(rootApi.util.resetApiState());
    return {...initialState};
  },
);

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchAppToken.fulfilled, (state, action) => {
      const payload = action.payload;
      state.token = payload?.token ?? '';
      state.user = payload?.user ?? {};
      state.isLoggedIn = true;
    });
    builder.addCase(logoutUser.fulfilled, (state, action) => {
      return {
        ...initialState,
      };
    });
  },
});

export const {setToken, authenticateUser} = slice.actions;

export default slice.reducer;
