import { MODE_COMPOSE_NEW, MODE_FORWARD, MODE_REPLY_SINGLE } from '@/helpers/constants';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  nutId: null,
  replyEmail: null,
  forwardEmail: null,
  mode: MODE_REPLY_SINGLE,
};

const slice = createSlice({
  name: 'emailComposer',
  initialState,
  reducers: {
    startEmailCompose: (state, action) => {
      state.nutId = action.payload?.nutId ?? {};
      state.replyEmail = action.payload?.email ?? {};
      state.mode = action.payload?.mode ?? MODE_COMPOSE_NEW;
    },
    startEmailReply: (state, action) => {
      state.nutId = action.payload?.nutId ?? {};
      state.replyEmail = action.payload?.email ?? {};
      state.mode = action.payload?.mode ?? MODE_REPLY_SINGLE;
    },
    startEmailForward: (state, action) => {
      state.nutId = action.payload?.nutId ?? {};
      state.forwardEmail = action.payload?.email ?? {};
      state.mode = action.payload?.mode ?? MODE_FORWARD;
    },
    cancelReplyEmail: (state, action) => {
      state.nutId = null;
      state.replyEmail = null;
      state.forwardEmail = null;
      state.mode = MODE_REPLY_SINGLE;
    },
  },
});

export const { startEmailCompose, startEmailReply, startEmailForward, cancelReplyEmail } =
  slice.actions;

export default slice.reducer;
