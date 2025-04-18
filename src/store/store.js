import { configureStore } from '@reduxjs/toolkit'
import userReducer from './reducers/usersReducer'
import HospitalReducer from './reducers/hospitalReducer'
import DoctorReducer from './reducers/doctorReducer'
export const store = configureStore({
  reducer: {
    User: userReducer,
    Hospital: HospitalReducer,
    Doctor: DoctorReducer,
  },
})