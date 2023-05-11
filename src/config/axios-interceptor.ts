import axios from 'axios';
import { SERVER_API_URL } from './constants';

const TIMEOUT = 1 * 60 * 1000;
axios.defaults.timeout = TIMEOUT;
axios.defaults.baseURL = SERVER_API_URL;
axios.defaults.withCredentials = true;

const setupAxiosInterceptors = () => {
   const onRequestSuccess = (config: any) => {
      return config;
   };
   const onResponseSuccess = (response: any) => {
      return response;
   };
   const onResponseError = (err: any) => {
      console.log(err);

      const status = err.status || (err.response ? err.response.status : 0);
      if (status === 403 || status === 401) {
         //   onUnauthenticated();
      }
      return Promise.reject(err);
   };

   axios.interceptors.request.use(onRequestSuccess);
   axios.interceptors.response.use(onResponseSuccess, onResponseError);
};

export default setupAxiosInterceptors;
