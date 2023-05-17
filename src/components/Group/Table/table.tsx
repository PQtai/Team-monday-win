import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { IColumn } from '~/shared/model/column';
import { IGroup } from '~/shared/model/group';
import { useState, useRef, useEffect, Fragment } from 'react';
import './table.scss';
import { message } from 'antd';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import MenuTask from '~/components/MenuTask/menuTask';
import { useAppDispatch, useAppSelector } from '~/config/store';
import TaskEdit from './TaskEdit/taskEdit';
import Column from '~/components/Column/column';
import ListType from '~/components/ListTypes/listTypes';
import { createColumn, resetDataCreateCol } from '~/components/MainTable/mainTable.reducer';
import { ITask, IValueOfTask } from '~/shared/model/task';
import { IResponseData } from '~/shared/model/global';
interface IPropsTable {
   columns: IColumn[];
   data: IGroup;
   setListsGroup: React.Dispatch<React.SetStateAction<IGroup[]>>;
}
const Table = ({ columns, data, setListsGroup }: IPropsTable) => {
   const [valueAddTask, setValueAddTask] = useState('');
   const [messageApi, contextHolder] = message.useMessage();
   const handleValueAdd = useRef<any>();
   // const handleEditInput = useRef<HTMLInputElement>(null);
   const { idBoard } = useParams();
   const [idTask, setIdTask] = useState('');
   const [isChecked, setIsChecked] = useState<ITaskChecked[]>([]);
   const [isOpenListTypes, setIsOpenListTypes] = useState<boolean>(false);
   const listColumns = useAppSelector((state) => state.mainTableSlice.listColumns.datas);
   const dispatch = useAppDispatch();
   const handleDeleteColumnAndTask = (idColumn: string) => {
      setListsGroup((prev) => {
         const updatedGroups = prev.map((group) => ({
            ...group,
            tasks: group.tasks.map((task) => ({
               ...task,
               values: task.values.filter((value) => value.belongColumn !== idColumn),
            })),
         }));
         return updatedGroups;
      });
   };

   interface ITaskChecked {
      _id: string;
   }
   // const handleRenameTask = (e: any, taskID: any) => {
   //    setIsRenameTask(true);
   // };
   const handleCheckboxChange = (e: any, taskID: any) => {
      setIdTask(e.target.dataset.id);
      if (e.target.checked) {
         setIsChecked((pre) => [...pre, { _id: taskID }]);
      } else {
         setIsChecked((pre) => pre.filter((item) => item._id !== taskID));
      }
   };
   const handleDeleteTask = async (taskID: string) => {
      const deleteTask = async () => {
         messageApi.loading('Đợi xý nhé !...');
         await axios.delete(`http://localhost:3001/v1/api/group/${data._id}/task/${taskID}`);
         // setListTask((pre) => pre.filter((item) => item._id !== taskID));
         messageApi.success('Xoá task thành công!');
      };
      deleteTask();
   };
   const handleAddColumn = (id: string) => {
      const addColumn = async () => {
         try {
            messageApi.loading('Đợi xý nhé...!');
            if (idBoard)
               await dispatch(
                  createColumn({
                     idBoard,
                     typeId: id,
                     position: listColumns.length + 1,
                  }),
               );
            // messageApi.success(`Thêm mới column ${res.data.metadata.column.name} thành công!`);
            messageApi.success(`Thêm mới column thành công!`);
         } catch (error) {
            messageApi.error(`${error}`);
         }
      };
      addColumn();
   };
   const handleAddTask = () => {
      if (valueAddTask !== '') {
         const addTask = async () => {
            messageApi.loading('Đợi xý nhé !...');
            const res = await axios.post<
               IResponseData<{
                  task: ITask;
               }>
            >(`http://localhost:3001/v1/api/board/${idBoard}/group/${data._id}/task`, {
               name: valueAddTask,
               position: data.tasks.length + 1,
            });
            messageApi.success('Tạo task thành công!');
            setValueAddTask('');
         };
         addTask();
      } else {
         messageApi.error('Vui lòng nhập tên task');
      }
   };
   return (
      <>
         <table className="table__group">
            {contextHolder}
            <thead className="table__group-header">
               <tr>
                  <th className="column__group-check">
                     <label htmlFor="checked"></label>
                     <input type="checkbox" id="checked" />
                  </th>
                  <th className="column__group">Task</th>
                  {columns.map((col) => {
                     return (
                        <Column
                           _id={col._id}
                           name={col.name}
                           position={col.position}
                           key={col._id}
                           handleDeleteColumnAndTask={handleDeleteColumnAndTask}
                        />
                     );
                  })}
                  <th className="column__group column__add">
                     <input className="col__group--check" type="checkbox" id="plus--col" />
                     <label
                        className="plus__lable"
                        htmlFor="plus--col"
                        onClick={() => {
                           setIsOpenListTypes((prev) => !prev);
                        }}
                     >
                        <div className="input--icon">
                           <FontAwesomeIcon icon={faPlus} />
                           {isOpenListTypes && <ListType handleAddColumn={handleAddColumn} />}
                        </div>
                     </label>
                  </th>
               </tr>
            </thead>
            <tbody className="table__data">
               {data.tasks.map((task) => {
                  return (
                     <tr className="table__data-task" key={task._id}>
                        <td className="table__data-task-value">
                           <label htmlFor="checked"></label>
                           <input
                              type="checkbox"
                              id="checked"
                              onChange={(e) => handleCheckboxChange(e, task._id)}
                              data-id={task._id}
                           />
                        </td>
                        <TaskEdit task={task} />
                        {task.values.map((itemValue) => {
                           return (
                              <td
                                 key={itemValue._id}
                                 style={{
                                    backgroundColor: `${
                                       itemValue.typeOfValue === 'multiple'
                                          ? itemValue.valueId?.color
                                          : ''
                                    }`,
                                 }}
                                 className="table__data-task-value"
                              >
                                 {itemValue.typeOfValue === 'multiple'
                                    ? itemValue.valueId?.value
                                    : itemValue.value}
                              </td>
                           );
                        })}
                     </tr>
                  );
               })}
               <tr className="table__data-task">
                  <td className="table__data-task-value">
                     <label htmlFor="checked"></label>
                     <input type="checkbox" id="checked" />
                  </td>
                  <td className="table__data-add-task">
                     <input
                        type="text"
                        value={valueAddTask}
                        placeholder="Add Task"
                        ref={handleValueAdd}
                        onChange={() => setValueAddTask(handleValueAdd.current?.value)}
                        onBlur={handleAddTask}
                     />
                  </td>
               </tr>
            </tbody>
         </table>
         <MenuTask
            setIsChecked={setIsChecked}
            tasks={isChecked}
            handleDeleteTask={handleDeleteTask}
            task={idTask}
         />
      </>
   );
};

export default Table;
