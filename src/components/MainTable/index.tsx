import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ButtonCustom from '../Button/ButtonCustom';
import Group from '../Group';
import HeadView from '../HeadView/';
import './mainTable.scss';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { StatusType } from '~/shared/model/global';
import { IGroup } from '~/shared/model/group';
import { useEffect } from 'react';
// import ShowNotification from '~/utils/showNotification';
import { useAppDispatch, useAppSelector } from '~/config/store';
import { createGroup, resetCreateGroup } from '../Group/group.reducer';
import { isNotification } from '../Notification/notification.reducer';
import { handleAddGroup } from '~/pages/Board/board.reducer';

interface MainTableProps {
  idBoard?: string;
}

const MainTable = ({ idBoard }: MainTableProps) => {
  const dataCreateGroup = useAppSelector((state) => state.groupSlice.createGroup);
  const listsGroup = useAppSelector((state) => state.boardSlice.currBoard.data?.groups)!;
  const getValueSearch = useAppSelector((state) => state.boardSlice.searchValue);
  const dispatch = useAppDispatch();

  const searchFilter = (dataSearch: string) => {
    const result = listsGroup?.filter(
      (group) =>
        group.name.toLocaleLowerCase().includes(dataSearch.toLocaleLowerCase()) ||
        group.tasks.some((task) =>
          task.name.toLocaleLowerCase().includes(dataSearch.toLocaleLowerCase()),
        ),
    );
    return result;
  };

  useEffect(() => {
    const newGroup = dataCreateGroup.data;
    if (newGroup) {
      // setListsGroup((prev) => {
      //    return [...prev, newGroup];
      // });
      dispatch(handleAddGroup(newGroup));
      dispatch(resetCreateGroup());
    }
  }, [dataCreateGroup]);
  const handleAddNewGroup = async (position?: number) => {
    if (idBoard && listsGroup) {
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
          position: position ?? listsGroup.length,
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

  return (
    <div className="main-table">
      {/* <p className="board__title">
            <span>{currBoard?.name}</span> <FontAwesomeIcon icon={faCircleExclamation} />
         </p> */}
      <HeadView />
      <div className="main__group__wrap">
        {searchFilter(getValueSearch)!?.length > 0 ? (
          searchFilter(getValueSearch)!.map((item: IGroup, index) => {
            return (
              <Group
                // handleDeleteGroup={handleDeleteGroup}
                handleAddNewGroup={handleAddNewGroup}
                // columns={currBoard?.columns}
                numberOfGroup={listsGroup.length}
                key={item._id}
                position={index}
                idBoard={idBoard}
                data={item}
              />
            );
          })
        ) : (
          <div className="search__empty" style={{ textAlign: 'center', padding: '20px 0' }}>
            <img
              src="https://cdn.monday.com/images/search_empty_state.svg"
              alt=""
              style={{ width: '300px' }}
            />
            <h3>No result found</h3>
            <p>Searching 10 of 10 column on this board</p>
          </div>
        )}
      </div>

      <ButtonCustom
        onClick={() => handleAddNewGroup()}
        statusType={StatusType.Boder}
        title="Add new group"
        leftIcon={<FontAwesomeIcon icon={faPlus} />}
      />
    </div>
  );
};

export default MainTable;
