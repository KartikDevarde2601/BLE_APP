import {createSlice} from '@reduxjs/toolkit';

function addTimeToData(data) {
  const now = new Date();
  const milliseconds = now.getMilliseconds();
  for (let i = 0; i < data.length; i++) {
    data[i]['time'] = milliseconds + 100;
  }
  return data;
}

export const dataSlice = createSlice({
  name: 'data',
  initialState: {
    graphdata: [],
    allgraphdata: [],
    data: [],
  },
  reducers: {
    setgraphdata: (state, action) => {
      let data = action.payload;
      let dataWithTime = addTimeToData(data);
      state.graphdata.push(...dataWithTime);
    },
    setdata: (state, action) => {
      state.data.push(...action.payload);
    },
    setAllGraphData: (state, action) => {
      state.allgraphdata = state.graphdata;
      state.graphdata = [];
    },
  },
});

export const {setgraphdata, setdata, setAllGraphData} = dataSlice.actions;

export default dataSlice.reducer;
