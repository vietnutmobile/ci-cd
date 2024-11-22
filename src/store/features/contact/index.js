import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  bulkSelectedContactIdsToDelete: [],
  bulkSelectedContactIds: [],
  selectedContactId: '',
};

const slice = createSlice({
  name: 'contact',
  initialState,
  reducers: {
    selectContactById: (state, action) => {
      state.selectedContactId = action.payload;
    },
    bulkSelectContactsToDelete: (state, action) => {
      state.bulkSelectedContactIdsToDelete = action.payload;
    },
    bulkSelectContactsByIds: (state, action) => {
      state.bulkSelectedContactIds = action.payload;
    },
  },
});

export const {
  selectContactById,
  bulkSelectContactsByIds,
  bulkSelectContactsToDelete,
} = slice.actions;

export default slice.reducer;
