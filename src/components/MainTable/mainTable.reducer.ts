import {
   createAsyncThunk,
   createSlice,
   isFulfilled,
   isPending,
   isRejected,
} from '@reduxjs/toolkit';
import { IColumn } from '~/shared/model/column';
import { SERVER_API_URL } from '~/config/constants';
import { IResponseData } from '~/shared/model/global';
import axios from 'axios';
import { serializeAxiosError } from '~/shared/reducers/reducer.utils';

export interface IDataCreateCol {
   column: IColumn;
   defaultValue:
      | {
           _id: string;
           value: string | null;
           color: string;
        }
      | null
      | string;
   tasksColumnsIds: string[];
}

interface IInitState {
   listColumns: {
      datas: IColumn[];
   };
   createCol: {
      data?: IDataCreateCol;
      loading: boolean;
      status: string;
      message: string;
   };
   deleteCol: {
      idDelete: string;
   };
}

const initialState: IInitState = {
   listColumns: {
      datas: [],
   },
   createCol: {
      data: undefined,
      loading: false,
      status: '',
      message: '',
   },
   deleteCol: {
      idDelete: '',
   },
};

export interface ICreateColumn {
   idBoard: string;
   typeId: string;
   position: number;
}
export interface IDeleteColumn {
   idBoard: string;
   idColumn: string;
}
export interface IEditColumn {
   idColumn: string;
   name: string;
}
//  actions
export const createColumn = createAsyncThunk(
   'create-column-slice',
   async (bodyRequest: ICreateColumn) => {
      const { idBoard, ...rest } = bodyRequest;
      const requestUrl = `${SERVER_API_URL}v1/api/board/${idBoard}/column`;
      return await axios.post<IResponseData<IDataCreateCol>>(requestUrl, rest);
   },
   { serializeError: serializeAxiosError },
);

export const deleteColumn = createAsyncThunk(
   'delete-column-slice',
   async (bodyRequest: IDeleteColumn) => {
      const { idBoard, idColumn } = bodyRequest;
      const requestUrl = `${SERVER_API_URL}v1/api/board/${idBoard}/column/${idColumn}`;
      return await axios.delete<IResponseData<undefined>>(requestUrl);
   },
   { serializeError: serializeAxiosError },
);

export const editColumn = createAsyncThunk(
   'edit-column-slice',
   async (bodyRequest: IEditColumn) => {
      const { idColumn, ...rest } = bodyRequest;
      const requestUrl = `${SERVER_API_URL}v1/api/column/${idColumn}`;
      return await axios.patch<
         IResponseData<{
            column: IColumn;
         }>
      >(requestUrl, rest);
   },
   { serializeError: serializeAxiosError },
);

export const mainTableSlice = createSlice({
   name: 'MainTableSlice',
   initialState,

   extraReducers(builder) {
      builder
         .addMatcher(isFulfilled(createColumn), (state, action) => {
            if (action.payload.data.metadata)
               state.listColumns.datas.push(action.payload.data.metadata?.column);

            state.createCol.data = action.payload.data.metadata;
            state.createCol.loading = false;
            state.createCol.status = action.payload.data.status;
            state.createCol.message = action.payload.data.message;
         })
         .addMatcher(isPending(createColumn), (state) => {
            state.createCol.loading = true;
         })
         .addMatcher(isRejected(createColumn), (state, action) => {
            state.createCol.loading = false;
            if (action?.error) {
               const { response } = action.error as { response: any };
               state.createCol.status = response.data.statusCode;
               state.createCol.message = response.data.message;
            }
         })
         .addMatcher(isFulfilled(deleteColumn), (state, action) => {});
   },
   reducers: {
      setListColumnsMainTable: (state, action) => {
         if (state.listColumns.datas) {
            return {
               ...state,
               listColumns: {
                  datas: action.payload,
               },
            };
         }
         // Return the state as is if state.listColumns.datas is undefined
         return state;
      },
      // addColMainTable: (state, action) => {
      //    if (state.listColumns.datas) {
      //       return {
      //          ...state,
      //          listColumns: {
      //             datas: [...state.listColumns.datas, action.payload],
      //          },
      //       };
      //    }
      //    // Return the state as is if state.listColumns.datas is undefined
      //    return state;
      // },
      renameColMainTable: (state, action) => {
         if (state.listColumns.datas) {
            return {
               ...state,
               listColumns: {
                  datas: action.payload,
               },
            };
         }
         // Return the state as is if state.listColumns.datas is undefined
         return state;
      },
      deleteColumnMainTable(state, action) {
         if (state.listColumns.datas) {
            return {
               ...state,
               listColumns: {
                  datas: [...action.payload],
               },
            };
         }
      },
      resetDataCreateCol(state) {
         state.createCol.data = undefined;
         state.createCol.loading = false;
         state.createCol.status = '';
         state.createCol.message = '';
      },
   },
});

// Action creators are generated for each case reducer function

export const {
   setListColumnsMainTable,
   renameColMainTable,
   resetDataCreateCol,
   deleteColumnMainTable,
} = mainTableSlice.actions;

export default mainTableSlice.reducer;
