import {
   createAsyncThunk,
   createSlice,
   isFulfilled,
   isPending,
   isRejected,
} from '@reduxjs/toolkit';
import { SERVER_API_URL } from '~/config/constants';
import {
   IUserWithToken,
   IResponseUser,
   IResponseGetMe,
   IUserNotToken,
} from '../model/authentication';
import { serializeAxiosError } from './reducer.utils';
import axios from 'axios';
import { IResponseData } from '../model/global';

export interface IAuthen {
   user: {
      data?: IUserNotToken;
      loading: boolean;
      error: boolean;
      status: string | number;
      mess: string;
   };
}

const baseUrl = SERVER_API_URL;
const initialState: IAuthen = {
   user: {
      data: undefined,
      loading: false,
      error: false,
      status: '',
      mess: '',
   },
};

// data create

export interface IDataLogin {
   email: string;
   password: string;
}

export interface IDataRegister {
   email: string;
   password: string;
   name: string;
}
export interface IDataVerifyAcc {
   email: string;
   code: string;
}
// actions

export const loginAccount = createAsyncThunk(
   'login-slice',
   async (infoLogin: IDataLogin) => {
      const requestUrl = `${baseUrl}v1/api/auth/signin`;
      return await axios.post<IResponseUser>(requestUrl, infoLogin);
   },
   { serializeError: serializeAxiosError },
);

export const registerAccount = createAsyncThunk(
   'register-slice',
   async (infoRegister: IDataRegister) => {
      const requestUrl = `${baseUrl}v1/api/auth/signup`;
      return await axios.post<IResponseUser>(requestUrl, infoRegister);
   },
   { serializeError: serializeAxiosError },
);
export const currenUser = createAsyncThunk(
   'current-user-slice',
   async () => {
      const requestUrl = `${baseUrl}v1/api/auth/me`;
      return await axios.get<IResponseGetMe>(requestUrl);
   },
   { serializeError: serializeAxiosError },
);

export const verifyEmail = createAsyncThunk(
   'verify-email-user-slice',
   async (data: IDataVerifyAcc) => {
      const requestUrl = `${baseUrl}v1/api/auth/verify`;
      return await axios.post<IResponseData<{ user: IUserNotToken }>>(requestUrl, data);
   },
   { serializeError: serializeAxiosError },
);

export const userSlice = createSlice({
   name: 'UserSlice',
   initialState,
   extraReducers(builder) {
      builder
         .addMatcher(isFulfilled(loginAccount), (state, action) => {
            state.user.data = action.payload.data.metadata;
            state.user.mess = action.payload.data.message;
            state.user.error = false;
            state.user.status = action.payload.data.status;
         })
         .addMatcher(isPending(loginAccount), (state) => {
            state.user.loading = true;
            state.user.status = '';
            state.user.mess = '';
            state.user.error = false;
         })
         .addMatcher(isRejected(loginAccount), (state, action) => {
            state.user.loading = false;
            state.user.error = true;

            if (action?.error) {
               const { response } = action.error as { response: any };
               state.user.status = response.data.statusCode;
               state.user.mess = response.data.message;
            }
         })
         .addMatcher(isFulfilled(registerAccount), (state, action) => {
            state.user.data = action.payload.data.metadata;
            state.user.mess = action.payload.data.message;
            state.user.error = false;
            state.user.status = action.payload.data.status;
         })
         .addMatcher(isPending(registerAccount), (state) => {
            state.user.loading = true;
            state.user.status = '';
            state.user.mess = '';
            state.user.error = false;
         })
         .addMatcher(isRejected(registerAccount), (state, action) => {
            state.user.loading = false;
            state.user.error = true;

            if (action?.error) {
               const { response } = action.error as { response: any };
               state.user.status = response.data.statusCode;
               state.user.mess = response.data.message;
            }
         })
         .addMatcher(isFulfilled(verifyEmail), (state, action) => {
            state.user.data = action.payload.data.metadata?.user;
            state.user.mess = action.payload.data.message;
            state.user.error = false;
            state.user.status = action.payload.data.status;
         })
         .addMatcher(isPending(verifyEmail), (state) => {
            state.user.loading = true;
            state.user.status = '';
            state.user.mess = '';
            state.user.error = false;
         })
         .addMatcher(isRejected(verifyEmail), (state, action) => {
            state.user.loading = false;
            state.user.error = true;

            if (action?.error) {
               const { response } = action.error as { response: any };
               state.user.status = response.data.statusCode;
               state.user.mess = response.data.message;
            }
         })
         .addMatcher(isFulfilled(currenUser), (state, action) => {
            state.user.data = action.payload.data.metadata;
            state.user.mess = action.payload.data.message;
            state.user.status = action.payload.data.statusCode;
            state.user.error = false;
         })
         .addMatcher(isPending(currenUser), (state) => {
            state.user.loading = true;
            state.user.status = '';
            state.user.mess = '';
            state.user.error = false;
         })
         .addMatcher(isRejected(currenUser), (state, action) => {
            state.user.loading = false;
            state.user.error = true;

            if (action?.error) {
               const { response } = action.error as { response: any };
               state.user.status = response.data.statusCode;
               state.user.mess = response.data.message;
            }
         });
   },
   reducers: {
      resetLogin(state) {
         state.user.loading = false;
         state.user.status = '';
         state.user.mess = '';
         state.user.error = false;
      },
      setUser : (state,action) => {
         state.user.data = action.payload
      }
   },
});

// Action creators are generated for each case reducer function
export const { resetLogin, setUser } = userSlice.actions;

export default userSlice.reducer;
