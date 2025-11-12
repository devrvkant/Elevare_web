import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  lastPrediction: null,
  formData: {
    course: "",
    specialization: "",
    skills: "",
    interests: "",
  },
  status: "idle", // idle | loading | succeeded | failed
  error: null,
};

const careerSlice = createSlice({
  name: "career",
  initialState,
  reducers: {
    setPrediction(state, action) {
      state.lastPrediction = action.payload;
      state.status = "succeeded";
    },
    setFormData(state, action) {
      state.formData = { ...state.formData, ...action.payload };
    },
    resetPrediction(state) {
      state.lastPrediction = null;
      state.status = "idle";
      state.error = null;
    },
    setStatus(state, action) {
      state.status = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
      state.status = "failed";
    },
  },
});

export const {
  setPrediction,
  setFormData,
  resetPrediction,
  setStatus,
  setError,
} = careerSlice.actions;

export default careerSlice.reducer;
