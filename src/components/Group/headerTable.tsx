import React, { useState, useEffect } from 'react';
import './group.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import ResizableBox from '../Resizable';
import { IColumn } from '~/shared/model/column';
import ListType from '../ListTypes/listTypes';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '~/config/store';
import { message } from 'antd';
import Column from '../Column/column';
import { createColumn } from '../MainTable/mainTable.reducer';
import { IGroup } from '~/shared/model/group';
// interface IPropsHeaderTable {
//    columns: IColumn[];
// }

interface IPropsHeaderTable {
   columns: IColumn[];
   data: IGroup;
}
const HeaderTable = ({ columns, data }: IPropsHeaderTable) => {
   console.log('data', data);
   const [isOpenListTypes, setIsOpenListTypes] = useState<boolean>(false);
   const listColumns = useAppSelector((state) => state.mainTableSlice.listColumns.datas);
   const { idBoard } = useParams();
   // const [listColumn, setListColumn] = useState<IColumn[]>([]);
   const dispatch = useAppDispatch();
   const [messageApi, contextHolder] = message.useMessage();
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
   return (
      <ul className="cols__group">
         {contextHolder}
         <li className="col__group__item">
            <label htmlFor="checked"></label>
            <input type="checkbox" id="checked" />
         </li>
         <ResizableBox id={'0'}>
            <span>Item</span>
         </ResizableBox>
         <li className="col__group__item">
            <input className="col__group--check" type="checkbox" id="plus--col" />
            <label className="plus__lable" htmlFor="plus--col">
               <div
                  className="input--icon"
                  onClick={() => {
                     setIsOpenListTypes((prev) => !prev);
                  }}
               >
                  <FontAwesomeIcon icon={faPlus} />
                  {isOpenListTypes && <ListType handleAddColumn={handleAddColumn} />}
               </div>
            </label>
         </li>
      </ul>
   );
};

export default HeaderTable;
