import { Button, Form, Input, message } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import './_login.scss';
import { useEffect, useState } from 'react';
import { Info } from '~/components/Notification';
import { IDataLogin, IInfoNotifi } from '../Register';
import Notification from '~/components/Notification';
import { loginAccount, resetLogin } from '~/shared/reducers/user.reducer';
import { useAppDispatch, useAppSelector } from '~/config/store';
import axios from 'axios';

const LoginStep2 = () => {
   const dispatch = useAppDispatch();
   const navigate = useNavigate();
   const [infoNotifi, setInfoNotifi] = useState<IInfoNotifi>({
      isOpen: false,
      info: Info.Open,
      description: '',
      placement: 'topRight',
   });

   // const messageLogin = useAppSelector((state) => state.userSlice.user.mess);
   // const errLogin = useAppSelector((state) => state.userSlice.user.error);
   const [messageApi, contextHolder] = message.useMessage();
   const userLogin = useAppSelector((state) => state.userSlice.user);

   const onFinish = async (values: IDataLogin) => {
      try {
         if (values.email && values.password) {
            await dispatch(loginAccount(values));
            if (typeof userLogin.data?.user !== 'undefined') {
               navigate('/');
            }
         }
      } catch (error) {
         console.log(error);
      }
   };

   return (
      <div className="form__container">
         {contextHolder}
         <h2 className="form__container-heading">Log in</h2>
         <Form name="basic" onFinish={onFinish} autoComplete="off" layout="vertical">
            <Form.Item
               name="email"
               label="Email"
               rules={[
                  {
                     type: 'email',
                     message: 'The input is not valid E-mail!',
                  },
                  {
                     required: true,
                     message: 'Please input your E-mail!',
                  },
               ]}
               className="form__container-item--flex"
            >
               <Input
                  placeholder="Example@company.com"
                  className="form__container-input"
                  name="email"
               />
            </Form.Item>
            <Form.Item
               name="password"
               rules={[{ required: true, message: 'Please input your Password!' }]}
               className="form__container-item--flex"
               label="Password"
            >
               <Input.Password
                  type="password"
                  className="form__container-input"
                  placeholder="Password"
                  name="password"
               />
            </Form.Item>
            <Link to="">
               <span className="link-forgot">Forgot your password?</span>
            </Link>
            <Form.Item>
               <Button type="primary" htmlType="submit" className="form__container-btn">
                  <span>Log in</span>
                  <ArrowRightOutlined />
               </Button>
            </Form.Item>

            <div className="suggest__signup-wrapper">
               <div className="suggest__signup-component">
                  <span>Don't have an account yet?</span>
                  <Link to="/register/-1" className="suggest__signup-link">
                     <span>Sign up</span>
                  </Link>
               </div>
               <div className="suggest__signup-support">
                  <span>Can't log in?</span>
                  <Link to="" className="suggest__signup-link">
                     <span>Visit our help center</span>
                  </Link>
               </div>
            </div>
         </Form>
         {infoNotifi.isOpen && (
            <Notification
               info={infoNotifi.info}
               description={infoNotifi.description}
               placement={infoNotifi.placement}
            />
         )}
      </div>
   );
};

export default LoginStep2;
