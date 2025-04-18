import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  doctor: null,
  doctors: [],
  loading: false,
  error: null,
  message: null,
};

export const doctorSlice = createSlice({
  name: "Doctor",
  initialState,
  reducers: {
    isDoctorSuccess: (state, action) => {
      state.loading = false;
      state.doctor = action.payload;
      state.error = null;
    },
    isDoctorFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    isDoctorsSuccess: (state, action) => {
      state.loading = false;
      state.doctors = action.payload;
      state.error = null;
    },
    isSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload;
      state.error = null;
    },
    isRequest: (state, action) => {
      state.loading = true;
    },
    clearDocError: (state) => {
      state.error = null;
    },
    clearDoctor: (state) => {
      state.doctor = null;
    },
    clearDocMessage: (state) => {
      state.message = null;
   },
   clearDoctors: (state) => {
    state.doctors = [];
  },
  },
});

export const { 
    isDoctorFail,
    isDoctorSuccess,
    isDoctorsSuccess,
    isRequest,
    clearDocError,
    clearDoctor,
    clearDocMessage,
    isSuccess,
    clearDoctors

   } =
  doctorSlice.actions;

export default doctorSlice.reducer;
