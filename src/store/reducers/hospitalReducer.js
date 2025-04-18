import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  hospital: null,
  hospitals: [],
  loading: false,
  error: null,
  message: null,
  searchResults: [],
};

export const hospitalSlice = createSlice({
  name: "Hospital",
  initialState,
  reducers: {
    isHospitalSuccess: (state, action) => {
      state.loading = false;
      state.hospital = action.payload;
      state.error = null;
    },
    isSearchSuccess: (state, action) => {
      state.loading = false;
      state.searchResults = action.payload;
      state.error = null;
    },
    isHospitalFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    isHospitalsSuccess: (state, action) => {
      state.loading = false;
      state.hospitals = action.payload;
      state.error = null;
    },
    isRequest: (state, action) => {
      state.loading = true;
    },
    isSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload;
      state.error = null;
    },
    clearHosError: (state) => {
      state.error = null;
    },
    clearHospital: (state) => {
      state.hospital = null;
    },
    clearHospitals: (state) => {
      state.hospitals = [];
    },
    clearHosMessage: (state) => {
      state.message = null;
   }
  }
});

export const { 
    isHospitalFail,
    isHospitalSuccess,
    isHospitalsSuccess,
    isRequest,
    clearHosError,
    clearHospital,
    isSuccess,
    clearHosMessage,
    isSearchSuccess,
    clearHospitals
   } =
  hospitalSlice.actions;

export default hospitalSlice.reducer;
