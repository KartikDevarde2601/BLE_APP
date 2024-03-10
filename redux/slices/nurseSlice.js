import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

export const createNurse = createAsyncThunk(
  'nurse/createNurse',
  async nurse => {
    const response = await axios.post('http://localhost:3000/nurse', nurse);
    return response.data;
  },
);

const nurseSlice = createSlice({
  name: 'nurse',
  initialState: {
    nurse: {},
    status: 'idle',
    error: null,
  },
  reducers: {
    setNurse: (state, action) => {
      state.nurse = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(createNurse.pending, state => {
        state.status = 'loading';
      })
      .addCase(createNurse.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.nurse = action.payload;
      })
      .addCase(createNurse.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const {setNurse} = nurseSlice.actions;
export default nurseSlice.reducer;
