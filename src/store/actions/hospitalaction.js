import axios from "../../utils/Axios";
import {
  isRequest,
  isSuccess,
  isHospitalFail,
  isHospitalSuccess,
  isHospitalsSuccess,
  isSearchSuccess,
} from "../reducers/hospitalReducer";
export { clearHosError, clearHosMessage ,clearHospitals} from "../reducers/hospitalReducer";
import  {fetchUserProfile} from './useraction'
import { isUserFail } from "../reducers/usersReducer";
export const createHospital =
  (info, navigate, enqueueSnackbar) => async (dispatch) => {
    dispatch(isRequest());
    try {
      const { data } = await axios.post("/api/v1/hospitals/add-hospital", info);
      if (data?.success) {
        dispatch(isHospitalSuccess(data?.data));
        enqueueSnackbar("Hospital added successfully", { variant: "success" });
        navigate("/");
      } else {
        throw new Error(data?.message || "Failed to create");
      }
    } catch (error) {
      dispatch(isHospitalFail(error.message));
    }
  };

export const fetchHospitals = () => async (dispatch) => {
  dispatch(isRequest());
  try {
    const { data } = await axios.get("/api/v1/hospitals/get-hospital");
    if (data?.success) {
      dispatch(isHospitalsSuccess(data?.data));
    } else {
      throw new Error(
        data?.message || "Failed to fetch hospitals"
      );
    }
  } catch (error) {
    dispatch(isHospitalFail(error.message));
  }
};

export const fetchSingleHospital = (id) => async (dispatch) => {
  dispatch(isRequest());
  try {
    const { data } = await axios.get(`/api/user/get-hospital/${id}`);
    console.log(data,"aagya");
    
    if (data?.success) {
      dispatch(isHospitalSuccess(data?.hospital));
    } else {
      throw new Error(
        data?.message || "Failed to fetch hospital"
      );
    }
  } catch (error) {
    dispatch(isHospitalFail(error.message));
  }
};
export const addHospitalReview = (info, id) => async (dispatch) => {
  dispatch(isRequest());
  try {
    const token = localStorage.getItem("utoken");

    if (!token) {
      dispatch(isUserFail("Please login to continue"));
      return;
    }
    const { data } = await axios.post(`/api/hospital-reviews/${id}`,info,{
      headers: {
        utoken:token
      }
    });

    if (data?.success) {
      dispatch(fetchUserProfile())
      dispatch(isSuccess(data.message));
    } else {
      throw new Error(
        data?.message || "something wrong happened"
      );
    }
  } catch (error) {
    dispatch(isHospitalFail(error.message));
  }
};

export const searchHospitals = (searchQuery) => async (dispatch) => {
  dispatch(isRequest());
  try {
    const { data } = await axios.get("/api/user/find-hospitals", {
      params: searchQuery, // Send search parameters in the query string
    });
    
    if (data?.success) {
      dispatch(isHospitalsSuccess(data?.hospitals));
    } else {
      throw new Error(data?.message || "Failed to fetch hospitals");
    }
  } catch (error) {
    dispatch(isHospitalFail(error.message));
  }
};

export const updateHospitalReview = (info, id,navigate) => async (dispatch) => {
  dispatch(isRequest());
  try {
    const token = localStorage.getItem("utoken");

    if (!token) {
      dispatch(isUserFail("Please login to continue"));
      navigate('/myratings')
      return;
    }
    const { data } = await axios.post(`/api/hospital-reviews/update-review/${id}`,info,{
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
    dispatch(isHospitalFail(error.message));
    navigate('/myratings')
  }
};

export const deleteHospitalReview = (id,navigate) => async (dispatch) => {
  dispatch(isRequest());
  try {
    const token = localStorage.getItem("utoken");

    if (!token) {
      dispatch(isUserFail("Please login to continue"));
      navigate('/myratings')
      return;
    }
    const { data } = await axios.get(`/api/hospital-reviews/delete/${id}`,{
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
    dispatch(isHospitalFail(error.message));
    navigate('/myratings')
  }
};

export const updateHospital =
  (id,info, navigate, enqueueSnackbar) => async (dispatch) => {
    dispatch(isRequest());
    try {
      const { data } = await axios.post(`/api/v1/hospitals/update-hospital/${id}`, info);
      if (data?.success) {
        dispatch(isSuccess());
        enqueueSnackbar("Hospital updated successfully", { variant: "success" });
       await dispatch(fetchHospitals());
        navigate("/update/hospital");
      } else {
        throw new Error(data?.message || "Failed to update");
      }
    } catch (error) {
      dispatch(isHospitalFail(error.message));
    }
  };