import axios from "../../utils/Axios";

import { 
  isLoginRequest, isUserFail, 
  isRequest, 
  isUserSuccess,
  logoutUser,
  clearUser,
  setUserMessage
} from "../reducers/usersReducer";
export {clearUserError,clearUserMessage} from '../reducers/usersReducer'
export const userLogin = (info,navigate,enqueueSnackbar) => async (dispatch) => {
  dispatch(isLoginRequest());
  try {
    const { data } = await axios.post("/api/v1/user/login", info);
    if (data?.success) {
      const token = data?.SuccessResponse?.data?.accessToken;
      localStorage.setItem('utoken', token);
      dispatch(isUserSuccess(data?.data.user));
      enqueueSnackbar("LoggedIn successfully", { variant: 'success' });
      navigate('/'); 
    } else {
      const errorMessage = data?.message || "Login failed";
      dispatch(isUserFail(errorMessage));
      navigate('/login');
    }
  } catch (error) {
    const errorMessage = error?.response?.data?.message || error.message || "Login failed";
    dispatch(isUserFail(errorMessage));
  }
};

export const userRegister = (info,navigate,enqueueSnackbar) => async (dispatch) => {
  dispatch(isRequest());
  try {
    const { data } = await axios.post("/api/v1/user/register", info);

    if (data?.success) {
      const token = data?.SuccessResponse?.data?.accessToken;
      localStorage.setItem('utoken', token);
      dispatch(isUserSuccess(data?.data.user));
      enqueueSnackbar("SignedUp successfully", { variant: 'success' });
      navigate('/'); 
    } else {
      const errorMessage = data?.message || "Registration failed";
      dispatch(isUserFail(errorMessage));
      navigate('/register');
    }
  } catch (error) {
    const errorMessage = error?.response?.data?.message || error.message || "Registration failed";
    dispatch(isUserFail(errorMessage));
  }
};

export const userUpdate = (info,id,navigate,enqueueSnackbar) => async (dispatch) => {
  dispatch(isRequest());
  try {
    const { data } = await axios.post(`/api/v1/user/update-user/${id}`, info);

    if (data?.success) {
      const token = data?.SuccessResponse?.data?.accessToken;
      localStorage.setItem('utoken', token);
      dispatch(isUserSuccess(data?.data.user));
      enqueueSnackbar("Updated successfully", { variant: 'success' });
      dispatch(userLogout());
      navigate('/'); 
    } else {
      const errorMessage = data?.message || "Updation failed";
      dispatch(isUserFail(errorMessage));
      navigate('/update');
    }
  } catch (error) {
    const errorMessage = error?.response?.data?.message || error.message || "Updation failed";
    dispatch(isUserFail(errorMessage));
  }
};

export const fetchUserProfile = () => async (dispatch) => {
  console.log("going well");
  
  dispatch(isLoginRequest());
  try {
    const token = localStorage.getItem('utoken');
    
    if (!token) {
      dispatch(isUserFail("Please login to continue"));
      return;
    }
    const { data } = await axios.get("/api/user/user", {
      headers: {
        utoken:token
      }
    });
    console.log(data,"fetchuserprofile");
    
    if (data?.success) {
      
      dispatch(isUserSuccess(data?.data));
    } else {
      console.log(data,"datata");
      
      const errorMessage = data?.message || "Internal server Error";
      dispatch(isUserFail(errorMessage));
    }
  } catch (error) {
    console.log("errrrr",error);
    
    const errorMessage = error?.response?.data?.message || error.message ;
    dispatch(isUserFail(errorMessage));
  }
};
export const googleLogin = (credential, navigate, enqueueSnackbar) => async (dispatch) => {
  dispatch(isLoginRequest());
  try {
    const { data } = await axios.post("/api/v1/user/google-login", { credential });
    
    if (data?.success) {
      const token = data?.SuccessResponse?.data?.accessToken;
      localStorage.setItem('utoken', token);
      dispatch(isUserSuccess(data?.data.user));
      enqueueSnackbar("Google login successful", { variant: 'success' });
      navigate('/');
    } else {
      const errorMessage = data?.message || "Google login failed";
      dispatch(isUserFail(errorMessage));
    }
  } catch (error) {
    const errorMessage = error?.response?.data?.message || error.message || "Google login failed";
    dispatch(isUserFail(errorMessage));
  }
};

export const kakaoLogin = (kakaoData, navigate, enqueueSnackbar) => async (dispatch) => {
  dispatch(isLoginRequest());
  try {
    const { data } = await axios.post("/api/v1/user/kakao-login", kakaoData);
    
    if (data?.success) {
      const token = data?.SuccessResponse?.data?.accessToken;
      localStorage.setItem('utoken', token);
      dispatch(isUserSuccess(data?.data.user));
      enqueueSnackbar("Kakao login successful", { variant: 'success' });
      navigate('/');
    } else {
      const errorMessage = data?.message || "Kakao login failed";
      dispatch(isUserFail(errorMessage));
    }
  } catch (error) {
    const errorMessage = error?.response?.data?.message || error.message || "Kakao login failed";
    dispatch(isUserFail(errorMessage));
  }
};

export const deleteUserProfile = (id,enqueueSnackbar) => async (dispatch) => {
  
  dispatch(isRequest());
  try {
    const token = localStorage.getItem('utoken');
    
    if (!token) {
      dispatch(isUserFail("Please login to continue"));
      return;
    }
    const { data } = await axios.get(`/api/v1/user/delete-user/${id}`, {
      headers: {
        utoken:token
      }
    });
    if (data?.success) {
      
      dispatch(userLogout())
      dispatch(clearUser());
      enqueueSnackbar("user deleted successfully", { variant: 'success' });
    } else {
      const errorMessage = data?.message || "Internal server Error";
      dispatch(isUserFail(errorMessage));
      
    }
  } catch (error) {
    const errorMessage = error?.response?.data?.message || error.message ;
    await dispatch(isUserFail(errorMessage));
    enqueueSnackbar(errorMessage, { variant: 'error' });
  }
};

export const savedDoctorProfile = (id) => async (dispatch) => {
  
  dispatch(isLoginRequest());
  try {
    const token = localStorage.getItem('utoken');
    
    if (!token) {
      dispatch(isUserFail("Please login to continue"));
      return;
    }
    console.log("working fine");
    const { data } = await axios.get(`/api/user/save/${id}`, {
      headers: {
        utoken:token
      }
    });
    console.log(data,"saveddata");
    
    if (data?.success) {
        dispatch(setUserMessage(data?.SuccessResponse?.message));
        dispatch(fetchUserProfile());
    } else {
      const errorMessage = data?.message || "Internal server Error";
      dispatch(isUserFail(errorMessage));
    }
  } catch (error) {
    const errorMessage = error?.response?.data?.message || error.message ;
    dispatch(isUserFail(errorMessage));
  }
};
export const userLogout = () => (dispatch) => {
  localStorage.removeItem('utoken');
  dispatch(logoutUser());
};
