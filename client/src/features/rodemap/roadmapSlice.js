import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: "idle",
  error: null,
};

const roadmapSlice = createSlice({
  name: "roadmap",
  initialState,
  reducers: {},
});

export default roadmapSlice.reducer;
