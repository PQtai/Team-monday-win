import ButtonCustom from '../Button/ButtonCustom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './headView.scss';
import { faAngleDown, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { IResponseData, StatusType } from '~/shared/model/global';
import { useAppDispatch, useAppSelector } from '~/config/store';
import { useEffect, useRef, useState } from 'react';
import { handleAddTaskToGroup, setSearchValueInput } from '~/pages/Board/board.reducer';
import Filter from './Filter';
import { useParams } from 'react-router-dom';
import { isNotification } from '../Notification/notification.reducer';
import { createGroup, resetCreateGroup } from '../Group/group.reducer';
import { message } from 'antd';
import axios from 'axios';
import { ITask } from '~/shared/model/task';
import images from '~/assets/svg';

const HeadView = () => {
  const { idBoard } = useParams();
  const [focusSearch, setFocusSearch] = useState<boolean>(false);
  const [valueSearch, setValueSearch] = useState<string>('');
  const [messageApi, contextHolder] = message.useMessage();
  const firstGroup = useAppSelector((state) => state.boardSlice.currBoard.data?.groups)![0];
  const dispatch = useAppDispatch();
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValueSearch(e.target.value);
    dispatch(setSearchValueInput(e.target.value));
  };

  const [isOpenFilter, setIsOpenFilter] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  });
  const handleClickOutside = (event: any) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpenFilter(false);
    }
  };

  const addNewTaskHandler = async () => {
    messageApi.loading('Đợi xý nhé !...');
    const res = await axios.post<
      IResponseData<{
        task: ITask;
      }>
    >(`http://localhost:3001/v1/api/board/${idBoard}/group/${firstGroup._id}/task`, {
      name: 'New Task',
      position: 0,
    });
    if (res.data.metadata) {
      dispatch(
        handleAddTaskToGroup({
          groupId: firstGroup._id,
          newTask: res.data.metadata?.task,
        }),
      );
      messageApi.success('Tạo task thành công!');
    }
  };

  const addNewGroupHandler = async () => {
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
          position: 0,
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
    <div className="table__head">
      <ButtonCustom statusType={StatusType.Primary} title="New Item" onClick={addNewTaskHandler} />
      <ButtonCustom
        statusType={StatusType.Primary}
        title="New Group"
        onClick={addNewGroupHandler}
      />
      <div
        className={`search ${focusSearch ? 'search-active' : ''}`}
        onClick={() => setFocusSearch(true)}
      >
        <div className="search__btn">
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </div>
        <input
          type="text"
          className="search__input"
          onBlur={() => setFocusSearch(false)}
          placeholder="Search"
          value={valueSearch}
          onChange={handleSearchInput}
        />
      </div>
      <ButtonCustom
        statusType={StatusType.Transparent}
        title="Filter"
        leftIcon={<img src={images.filter} alt="" />}
        rightIcon={<FontAwesomeIcon icon={faAngleDown} />}
      >
        {true && <Filter ref={dropdownRef} />}
      </ButtonCustom>
    </div>
  );
};

export default HeadView;
