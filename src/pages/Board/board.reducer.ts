import {
   PayloadAction,
   createAsyncThunk,
   createSlice,
   isFulfilled,
   isPending,
   isRejected,
} from '@reduxjs/toolkit';
import axios from 'axios';
import { IDataCreateCol } from '~/components/MainTable/mainTable.reducer';
import { SERVER_API_URL } from '~/config/constants';
import { IBoard, IBoardResponse, IBoardsResponse } from '~/shared/model/board';
import { IResponseData } from '~/shared/model/global';
import { IValueOfTask } from '~/shared/model/task';
import { serializeAxiosError } from '~/shared/reducers/reducer.utils';

const apiUrl = SERVER_API_URL;
// slice

interface IInitState {
   listBoard: {
      datas?: IBoard[];
      loading: boolean;
      error: boolean;
      status: string | number;
      mess: string;
   };
   currBoard: {
      data?: IBoard;
      loading: boolean;
      error: boolean;
      status: string | number;
      mess: string;
   };
}

const initialState: IInitState = {
   listBoard: {
      datas: [],
      loading: false,
      error: false,
      status: '',
      mess: '',
   },
   currBoard: {
      data: undefined,
      loading: false,
      error: false,
      status: '',
      mess: '',
   },
};

// body request

interface IParamsRequest {
   id: string;
}

interface ICreateBoard {
   idWorkspace: string;
   name: string;
}
interface IEditBoard {
   idBoard: string;
   name: string;
   description?: string;
}

// actions
// Get all board
export const getListBoards = createAsyncThunk(
   'get-list-boards-slice',
   async (params: IParamsRequest) => {
      const requestUrl = `${apiUrl}v1/api/workspace/${params.id}/board`;
      return await axios.get<IResponseData<IBoardsResponse<IBoard[]>>>(requestUrl);
   },
   { serializeError: serializeAxiosError },
);

// Get detail board
export const getBoardDetail = createAsyncThunk(
   'get-board-detail-slice',
   async (params: IParamsRequest) => {
      const requestUrl = `${apiUrl}v1/api/board/${params.id}`;
      return await axios.get<IResponseData<IBoardResponse<IBoard>>>(requestUrl);
   },
   { serializeError: serializeAxiosError },
);

// Create  board

export const createBoard = createAsyncThunk(
   'create-board-slice',
   async (bodyRequest: ICreateBoard) => {
      const requestUrl = `${apiUrl}v1/api/workspace/${bodyRequest.idWorkspace}/board`;
      return await axios.post<IResponseData<IBoard>>(requestUrl, {
         name: bodyRequest.name,
      });
   },
   { serializeError: serializeAxiosError },
);
// Edit board
export const editBoard = createAsyncThunk(
   'edit-board-slice',
   async (bodyRequest: IEditBoard) => {
      const { idBoard, ...rest } = bodyRequest;
      const requestUrl = `${apiUrl}v1/api/board/${idBoard}`;
      return await axios.patch<IResponseData<IBoard>>(requestUrl, rest);
   },
   { serializeError: serializeAxiosError },
);

// Delete board
export const deleteBoard = createAsyncThunk(
   'delete-board-slice',
   async (params: IParamsRequest) => {
      const { id } = params;
      const requestUrl = `${apiUrl}v1/api/board/${id}`;
      return await axios.delete<IResponseData<undefined>>(requestUrl);
   },
   { serializeError: serializeAxiosError },
);

const boardSlice = createSlice({
   name: 'BoardSlice',
   initialState,
   extraReducers(builder) {
      builder
         .addMatcher(isFulfilled(getListBoards), (state, action) => {
            state.listBoard.datas = action.payload.data.metadata?.boards;
            state.listBoard.error = false;
            state.listBoard.loading = false;
            state.listBoard.status = action.payload.data.status;
            state.listBoard.mess = action.payload.data.message;
         })
         .addMatcher(isPending(getListBoards), (state, action) => {
            state.listBoard.loading = true;
         })
         .addMatcher(isRejected(getListBoards), (state, action) => {
            state.listBoard.error = true;
            state.listBoard.loading = false;
            if (action?.error) {
               const { response } = action.error as { response: any };
               state.listBoard.status = response.status;
               state.listBoard.mess = response.message;
            }
         })
         .addMatcher(isFulfilled(getBoardDetail), (state, action) => {
            state.currBoard.data = action.payload.data.metadata?.board;
            state.listBoard.error = false;
            state.listBoard.loading = false;
            state.listBoard.status = action.payload.data.status;
            state.listBoard.mess = action.payload.data.message;
         })
         .addMatcher(isPending(getBoardDetail), (state, action) => {
            state.listBoard.loading = true;
         })
         .addMatcher(isRejected(getBoardDetail), (state, action) => {
            state.listBoard.error = true;
            state.listBoard.loading = false;
            if (action?.error) {
               const { response } = action.error as { response: any };
               state.listBoard.status = response.status;
               state.listBoard.mess = response.message;
            }
         })
         .addMatcher(isFulfilled(createBoard), (state, action) => {
            state.currBoard.data = action.payload.data.metadata;
            const newBoard = action.payload.data.metadata;
            if (newBoard && state.listBoard.datas) {
               state.listBoard.datas.push(newBoard);
            }
            state.currBoard.error = false;
            state.currBoard.loading = false;
            state.currBoard.status = action.payload.data.status;
            state.currBoard.mess = action.payload.data.message;
         })
         .addMatcher(isFulfilled(getBoardDetail), (state, action) => {
            state.currBoard.data = action.payload.data.metadata?.board;
         })
         .addMatcher(isPending(getBoardDetail), (state, action) => {
            state.currBoard.loading = true;
         })
         .addMatcher(isRejected(getBoardDetail), (state, action) => {
            state.currBoard.error = true;
            state.currBoard.loading = false;
            if (action?.error) {
               const { response } = action.error as { response: any };
               state.currBoard.status = response.status;
               state.currBoard.mess = response.message;
            }
         });
      // .addMatcher(isFulfilled(editBoard), (state, action) => {
      //    state.currBoard.data = action.payload.data.metadata;
      //    state.currBoard.error = false;
      //    state.currBoard.loading = false;
      //    state.currBoard.status = action.payload.data.status;
      //    state.currBoard.mess = action.payload.data.message;
      // })
      // .addMatcher(isPending(editBoard), (state, action) => {
      //    state.currBoard.loading = true;
      // })
      // .addMatcher(isRejected(editBoard), (state, action) => {
      //    state.currBoard.error = true;
      //    state.currBoard.loading = false;
      //    if (action?.error) {
      //       const { response } = action.error as { response: any };
      //       state.currBoard.status = response.status;
      //       state.currBoard.mess = response.message;
      //    }
      // })
      // .addMatcher(isFulfilled(deleteBoard), (state, action) => {
      //    state.currBoard.data = action.payload.data.metadata;
      //    state.currBoard.error = false;
      //    state.currBoard.loading = false;
      //    state.currBoard.status = action.payload.data.status;
      //    state.currBoard.mess = action.payload.data.message;
      // })
      // .addMatcher(isPending(deleteBoard), (state, action) => {
      //    state.currBoard.loading = true;
      // })
      // .addMatcher(isRejected(deleteBoard), (state, action) => {
      //    state.currBoard.error = true;
      //    state.currBoard.loading = false;
      //    if (action?.error) {
      //       const { response } = action.error as { response: any };
      //       state.currBoard.status = response.status;
      //       state.currBoard.mess = response.message;
      //    }
      // });
   },
   reducers: {
      setDefaultValueToTask: (state, action: PayloadAction<IDataCreateCol>) => {
         const { data } = state.currBoard;
         if (data) {
            const { column, tasksColumnsIds, defaultValue } = action.payload;
            const newValueTasks = tasksColumnsIds.map((taskId) => {
               const defaultValueTask: IValueOfTask = {
                  belongColumn: column._id,
                  typeOfValue: defaultValue ? 'multiple' : 'single',
                  _id: taskId,
                  value: defaultValue ? null : defaultValue,
                  valueId: defaultValue && typeof defaultValue !== 'string' ? defaultValue : null,
                  name: column.name,
                  position: column.position,
               };
               return defaultValueTask;
            });
            console.log(newValueTasks);

            // Tạo giá trị mặc định mới dạng IValueOfTask từ column vừa tạo

            // Cập nhật giá trị mặc định cho tất cả các values trong tasks
            const updatedGroups = data.groups.map((group) => {
               const updatedTasks = group.tasks.map((task, index) => ({
                  ...task,
                  values: [...task.values, newValueTasks[index]],
               }));

               return {
                  ...group,
                  tasks: updatedTasks,
               };
            });

            // Trả về state mới với currBoard.data đã được cập nhật
            return {
               ...state,
               currBoard: {
                  ...state.currBoard,
                  data: {
                     ...data,
                     groups: updatedGroups,
                  },
               },
            };
         }

         return state;
      },

      resetCurrBoard(state) {
         state.currBoard = {
            data: undefined,
            loading: false,
            error: false,
            status: '',
            mess: '',
         };
      },
   },
});

export const { resetCurrBoard, setDefaultValueToTask } = boardSlice.actions;

export default boardSlice.reducer;
