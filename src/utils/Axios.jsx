// import axios from 'axios';

// const baseURL = window.location.hostname === 'localhost'
//   ? 'http://localhost:5000'
//   : 'https://medimind-backend.onrender.com';
// const Instance = axios.create({
//     baseURL,
//     withCredentials: true,
// })

// Instance.interceptors.request.use(
//     (config) => {
//       const token = localStorage.getItem("utoken");
  
//       if (token) {
//         config.headers.utoken = token;
//       }
  
//       return config;
//     },
//     (error) => {
//       // Handle any request errors
//       return Promise.reject(error);
//     }
//   );
  
  
// export default Instance;




import axios from 'axios';

const baseURL = 'https://medimind-backend.onrender.com'; 
const Instance = axios.create({
  baseURL,
  withCredentials: true,
});

Instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("utoken");
    if (token) {
      config.headers.utoken = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default Instance;
