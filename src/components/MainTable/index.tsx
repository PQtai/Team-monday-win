import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ButtonCustom from '../Button/ButtonCustom';
import Group from '../Group';
import HeadView from '../HeadView';
import './mainTable.scss';
import { faCircleExclamation, faPlus } from '@fortawesome/free-solid-svg-icons';
import { StatusType } from '~/shared/model/global';
import { IBoard } from '~/shared/model/board';
import { IGroup } from '~/shared/model/group';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '~/config/store';
import { createGroup, deleteGroup, resetCreateGroup } from '../Group/group.reducer';
import { isNotification } from '../Notification/notification.reducer';
import { getListTypes } from '../ListTypes/listTypes.reducer';
import { resetDataCreateCol, setListColumnsMainTable } from './mainTable.reducer';
import { IValueOfTask } from '~/shared/model/task';
interface IPropMainTable {
   currBoard: IBoard;
}

const MainTable = ({ currBoard }: IPropMainTable) => {
   const dataCreateGroup = useAppSelector((state) => state.groupSlice.createGroup);
   const listColumns = useAppSelector((state) => state.mainTableSlice.listColumns.datas);
   const dataCreateCol = useAppSelector((state) => state.mainTableSlice.createCol.data);

   const [listsGroup, setListsGroup] = useState<IGroup[]>(currBoard.groups);
   console.log(listsGroup);

   const dispatch = useAppDispatch();
   const { idBoard } = useParams();
   const notifi = useAppSelector((state) => state.groupSlice.createGroup);

   useEffect(() => {
      dispatch(getListTypes());
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);
   useEffect(() => {
      if (currBoard) {
         setListsGroup(currBoard.groups);
         // const listTask: ITask[] = currBoard.groups.flatMap((group) => group.tasks);
         // setListTask(listTask);
      }
   }, [currBoard]);

   useEffect(() => {
      dispatch(setListColumnsMainTable(currBoard.columns));
   }, [currBoard.columns, dispatch]);

   useEffect(() => {
      const newGroup = dataCreateGroup.data;
      if (newGroup) {
         setListsGroup((prev) => {
            return [...prev, newGroup];
         });
         dispatch(resetCreateGroup());
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [dataCreateGroup]);

   // useEffect(() => {
   //    if (dataCreateCol) {
   //       console.log(dataCreateCol);

   //       // dispatch(setDefaultValueToTask(dataCreateCol));
   //       dispatch(resetDataCreateCol());
   //    }
   // }, [dataCreateCol]);

   useEffect(() => {
      if (dataCreateCol !== undefined) {
         setListsGroup((prev) => {
            const { _id, name, position } = dataCreateCol.column;
            const defaultValue = dataCreateCol.defaultValue;
            const valueIds = [...dataCreateCol.tasksColumnsIds];
            const updatedTasks = prev.map((group, index1) => ({
               ...group,
               tasks: group.tasks.map((task, index) => {
                  const valueTaskId = valueIds.shift();
                  const newDefaultValueTask: IValueOfTask = {
                     _id: valueTaskId!,
                     belongColumn: _id,
                     value: defaultValue ? null : defaultValue,
                     valueId:
                        defaultValue && typeof defaultValue !== 'string' ? defaultValue : null,
                     name,
                     position,
                     typeOfValue: defaultValue ? 'multiple' : 'single',
                  };

                  const prevValue = [...task.values];

                  prevValue.push(newDefaultValueTask);
                  return {
                     ...task,
                     values: prevValue,
                  };
               }),
            }));
            return updatedTasks;
         });
      }
      dispatch(resetDataCreateCol());
   }, [dataCreateCol, dispatch]);

   const handleAddNewGroup = async () => {
      if (idBoard) {
         dispatch(
            isNotification({
               type: 'loading',
               message: 'Đang xử lý...',
               autoClose: 1000,
               isOpen: true,
            }),
         );
         await dispatch(
            createGroup({
               idBoard,
               name: 'New Group',
               position: listsGroup.length + 1,
            }),
         );
         dispatch(
            isNotification({
               type: 'success',
               message: 'Đã thêm group thành công!',
               autoClose: 1000,
               isOpen: true,
            }),
         );
         dispatch(resetCreateGroup());
      }
   };
   const handleDeleteGroup = (id: string) => {
      setListsGroup((prev) => {
         const newListsGroup = [...prev].filter((group) => group._id !== id);
         return newListsGroup;
      });
      dispatch(
         isNotification({
            type: 'success',
            message: 'Đã xoá group thành công!',
            autoClose: 1000,
            isOpen: true,
         }),
      );
      if (idBoard)
         dispatch(
            deleteGroup({
               idGroup: id,
               idBoard,
            }),
         );
   };
   return (
      <div className="main-table">
         <p className="board__title">
            <span>{currBoard?.name}</span> <FontAwesomeIcon icon={faCircleExclamation} />
         </p>
         <HeadView />
         <div className="main__group__wrap">
            {listsGroup &&
               listsGroup.map((item: IGroup, index) => {
                  return (
                     <Group
                        handleDeleteGroup={handleDeleteGroup}
                        handleAddNewGroup={handleAddNewGroup}
                        columns={listColumns}
                        key={item._id}
                        data={item}
                        setListsGroup={setListsGroup}
                     />
                  );
               })}
         </div>

         <ButtonCustom
            onClick={handleAddNewGroup}
            statusType={StatusType.Boder}
            title="Add new group"
            leftIcon={<FontAwesomeIcon icon={faPlus} />}
         />
      </div>
   );
};

export default MainTable;
