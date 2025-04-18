import axios from "../../utils/Axios";
import { isRequest, isDoctorFail, isDoctorSuccess, isDoctorsSuccess,isSuccess } from "../reducers/doctorReducer";
export { clearDocError, clearDocMessage ,clearDoctors} from "../reducers/doctorReducer";
import  {fetchUserProfile} from './useraction'
import { isUserFail } from "../reducers/usersReducer";
export const createDoctor = (info, navigate, enqueueSnackbar) => async (dispatch) => {
    dispatch(isRequest());
    try {
      const { data } = await axios.post("/api/v1/doctors/add-doctor", info);
      if (data?.success) {
        dispatch(isDoctorSuccess(data?.data));
        enqueueSnackbar("Doctor added successfully", { variant: "success" });
        navigate("/");
      } else {
        throw new Error(data?.message || "Failed to create");
      }
    } catch (error) {
      dispatch(isDoctorFail(error.message));
    }
  };
  
  export const fetchDoctors = () => async (dispatch) => {
    dispatch(isRequest());
    try {
      const { data } = await axios.get("/api/v1/doctors/get-doctor");
      console.log(data);
      
      if (data?.success) {
        dispatch(isDoctorsSuccess(data?.data));
      } else {
        throw new Error(data?.message || "Failed to fetch doctors");
      }
    } catch (error) {
      dispatch(isDoctorFail(error.message));
    }
  };
  
  export const fetchSingleDoctor = (id) => async (dispatch) => {
    dispatch(isRequest());
    try {
      const { data } = await axios.get(`/api/user/get-doctor/${id}`);
      if (data?.success) {
        dispatch(isDoctorSuccess(data?.data));
      } else {
        throw new Error(data?.message || "Failed to fetch doctor");
      }
    } catch (error) {
      dispatch(isDoctorFail(error.message));
    }
  };
  
  export const addDoctorReview = (info, id) => async (dispatch) => {
    dispatch(isRequest());
    try {
      const token = localStorage.getItem("utoken");
  
      if (!token) {
        dispatch(isUserFail("Please login to continue"));
        return;
      }
      const { data } = await axios.post(`/api/doctor-reviews/${id}`,info,{
        headers: {
          utoken:token
        }
      });
  
      if (data?.success) {
        dispatch(isSuccess(data.message));
      } else {
        throw new Error(
          data?.message || "something wrong happened"
        );
      }
    } catch (error) {
      dispatch(isDoctorFail(error.message));
    }
  };

  export const searchDoctors = (searchQuery) => async (dispatch) => {
    dispatch(isRequest());
    try {
      const { data } = await axios.get("/api/user/find-doctor", {
        params: searchQuery, // Send search parameters in the query string
      });
      console.log(data,"detsts");
      
      if (data?.success !== false) {
        dispatch(isDoctorsSuccess(data?.data));
      } else {
        throw new Error(data?.message || "Failed to fetch doctors");
      }
    } catch (error) {
      console.log(error,"hai error");
      
      dispatch(isDoctorFail(error.message));
    }
  };

  export const updateDoctorReview = (info, id,navigate) => async (dispatch) => {
    dispatch(isRequest());
    try {
      const token = localStorage.getItem("utoken");
  
      if (!token) {
        dispatch(isUserFail("Please login to continue"));
        navigate('/myratings')
        return;
      }
      const { data } = await axios.post(`/api/doctor-reviews/update-review/${id}`,info,{
        headers: {
          utoken:token
        }
      });
  
      if (data?.success) {
        dispatch(isSuccess(data.message));
        dispatch(fetchUserProfile())
        navigate('/myratings')
      } else {
        throw new Error(
          data?.message || "something wrong happened"
        );
      }
    } catch (error) {
      dispatch(isDoctorFail(error.message));
      navigate('/myratings')
    }
  };
  
  export const deleteDoctorReview = (id,navigate) => async (dispatch) => {
    dispatch(isRequest());
    try {
      const token = localStorage.getItem("utoken");
  
      if (!token) {
        dispatch(isUserFail("Please login to continue"));
        navigate('/myratings')
        return;
      }
      const { data } = await axios.get(`/api/doctor-reviews/delete/${id}`,{
        headers: {
          utoken:token
        }
      });
  
      if (data?.success) {
        dispatch(isSuccess(data.message));
        dispatch(fetchUserProfile())
        navigate('/myratings')
      } else {
        throw new Error(
          data?.message || "something wrong happened"
        );
      }
    } catch (error) {
      dispatch(isDoctorFail(error.message));
      navigate('/myratings')
    }
  };
  
export const updateDoctor =
  (id,info, navigate, enqueueSnackbar) => async (dispatch) => {
    dispatch(isRequest());
    try {
      const { data } = await axios.post(`/api/v1/doctors/update-doctor/${id}`, info);
      if (data?.success) {
        dispatch(isSuccess());
        enqueueSnackbar("doctor updated successfully", { variant: "success" });
       await dispatch(fetchDoctors());
        navigate("/update/doctor");
      } else {
        throw new Error(data?.message || "Failed to update");
      }
    } catch (error) {
      dispatch(isDoctorFail(error.message));
    }
  };