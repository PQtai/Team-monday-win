import { faDotCircle, faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef, useState } from 'react';
import './column.scss';
import { Dropdown, MenuProps } from 'antd';
import { useAppDispatch, useAppSelector } from '~/config/store';
import images from '~/assets/svg';
import { useParams } from 'react-router-dom';
import {
   ICreateColumn,
   IDeleteColumn,
   createColumn,
   deleteColumn,
   deleteColumnMainTable,
   editColumn,
   renameColMainTable,
} from '../MainTable/mainTable.reducer';
import { ITask } from '~/shared/model/task';
interface IPropsColumn {
   name: string;
   _id: string;
   position: number;
   handleDeleteColumnAndTask: (idColumn: string) => void;
}
const Column = ({ name, _id, position, handleDeleteColumnAndTask }: IPropsColumn) => {
   const [isEditInput, setIsEditInput] = useState<boolean>(false);
   const listTypes = useAppSelector((state) => state.listTypesSlice.listTypes.datas);
   const listColumns = useAppSelector((state) => state.mainTableSlice.listColumns.datas);
   //    const dataCreateCol = useAppSelector((state) => state.columnSlice.createColumn.data);
   //    const statusDeleteCol = useAppSelector((state) => state.columnSlice.deleteColumn.status);
   const { edit, deleteIcon, add } = images;
   const inputElement = useRef<HTMLInputElement>(null);
   const { idBoard } = useParams();
   const dispatch = useAppDispatch();
   const [valueInput, setValueInput] = useState<string>(name);
   const handleCreateColumn = ({ idBoard, typeId, position }: ICreateColumn) => {
      dispatch(
         createColumn({
            idBoard,
            typeId,
            position,
         }),
      );
   };

   console.log(name);

   const handleDeleteColumn = ({ idBoard, idColumn }: IDeleteColumn) => {
      dispatch(
         deleteColumn({
            idBoard,
            idColumn,
         }),
      );
      handleDeleteColumnAndTask(idColumn);
      const newArr = listColumns.filter((column) => column._id !== _id);
      //          console.log(newArr);

      dispatch(deleteColumnMainTable(newArr));
   };

   const handleEditNameCol = (e: React.FocusEvent<HTMLInputElement, Element>) => {
      const target = e.target as HTMLInputElement;
      if (target.value !== name) {
         const newColRename = listColumns.map((column) => {
            if (column._id === _id) {
               return {
                  ...column,
                  name: target.value,
               };
            }
            return column;
         });
         console.log(newColRename);

         dispatch(renameColMainTable(newColRename));
         dispatch(
            editColumn({
               idColumn: _id,
               name: target.value,
            }),
         );
      }
   };

   const items: MenuProps['items'] = [
      {
         key: '1',
         label: <span>Add new colunm</span>,
         icon: <img src={add} alt="icon-board" />,
         //    onClick: handleAddNewGroup,
         children: listTypes?.map((item, index) => {
            return {
               key: `2-${index}`,
               label: item.name,
               icon: <img src={add} alt="dropdow--icon" />,
               onClick: () => {
                  if (idBoard)
                     handleCreateColumn({
                        idBoard,
                        typeId: item._id,
                        position,
                     });
               },
            };
         }),
      },
      //   {
      //      key: '2',
      //      label: <span>Move to</span>,
      //      //    icon: <img src={move} alt="icon-board" />,
      //      children: [
      //         {
      //            key: '2-1',
      //            label: 'Move to board',
      //         },
      //      ],
      //   },
      {
         key: '2',
         label: <span>Rename column</span>,
         icon: <img src={edit} alt="icon-board" />,
         onClick: () => {
            setIsEditInput(true);
            inputElement.current?.focus();
            console.log(inputElement.current);
         },
      },
      {
         key: '3',
         label: <span>Delete column</span>,
         icon: <img src={deleteIcon} alt="icon-board" />,
         onClick: () => {
            if (idBoard)
               handleDeleteColumn({
                  idColumn: _id,
                  idBoard,
               });
         },
      },
   ];

   return (
      <th
         onClick={() => {
            console.log(name);
         }}
         className="column__group"
      >
         {isEditInput ? (
            <input
               className="col__item--input"
               ref={inputElement}
               autoFocus
               onBlur={(e) => {
                  handleEditNameCol(e);
                  setIsEditInput(false);
               }}
               type="text"
               onChange={(e) => {
                  setValueInput(e.target.value);
               }}
               value={valueInput}
            />
         ) : (
            <span
               onClick={() => {
                  setIsEditInput(true);
               }}
            >
               {valueInput}
            </span>
         )}
         {!isEditInput && (
            <Dropdown
               placement="bottomRight"
               overlayStyle={{
                  width: '250px',
               }}
               trigger={['click']}
               menu={{ items }}
            >
               <button className="btn__option--col">
                  <FontAwesomeIcon icon={faEllipsis} />
               </button>
            </Dropdown>
         )}
      </th>
   );
};

export default Column;
