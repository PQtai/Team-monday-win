import './_register.scss';
import { Row, Col } from 'antd';
import { Button, Form, Input } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import ImgBanner from '~/assets/images/register/welcome-to-monday.jpg';
import axios from 'axios';
import Notification from '~/components/Notification';
import { useState } from 'react';
import { NotificationPlacement } from 'antd/es/notification/interface';
import { IResponseData } from '~/shared/model/global';
import { IResponseRegister } from '~/shared/model/register';
import { useDispatch } from 'react-redux';
import { setToken } from '~/services/redux/features/updateToken';
interface IDataRegister {
   email: string;
   name: string;
   password: string;
}
interface IInfoNotifi {
   isOpen: boolean;
   info: 'success' | 'warning' | 'open' | 'error' | 'info';
   description: string;
   placement: NotificationPlacement;
}
const Register = () => {
   const baseUrl = process.env.REACT_APP_SERVER_API_URL;
   const navigate = useNavigate();
   const dispatch = useDispatch();
   const [infoNotifi, setInfoNotifi] = useState<IInfoNotifi>({
      isOpen: false,
      info: 'open',
      description: '',
      placement: 'topLeft',
   });

   const onFinish = async (values: IDataRegister) => {
      if (values) {
         const requestUrl = `${baseUrl}v1/api/auth/signup`;
         const response = await axios.post<IResponseData<IResponseRegister>>(requestUrl, values);
         const { accessToken } = response.data.metadata;
         if (accessToken) {
            setInfoNotifi({
               isOpen: true,
               info: 'success',
               description: 'Register successfully',
               placement: 'topLeft',
            });
            dispatch(setToken(accessToken));
            localStorage.setItem('token', JSON.stringify(accessToken));
            setTimeout(() => {
               navigate('/');
            }, 2000);
         } else {
            setInfoNotifi({
               isOpen: true,
               info: 'error',
               description: response.data.message,
               placement: 'topLeft',
            });
         }
      }
   };
   return (
      <Row>
         <Col span={14}>
            <div className="form__register">
               <Form
                  layout="vertical"
                  className="form__container"
                  name="basic"
                  onFinish={onFinish}
                  autoComplete="off"
               >
                  <h1 className="form__container-title">Welcome to monday.com</h1>
                  <p className="form__container-des">
                     Get started - it's free. No credit card needed.
                  </p>
                  <Form.Item
                     label="email"
                     name="email"
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
                  >
                     <Input placeholder="Example@company.com" className="form__container-input" />
                  </Form.Item>

                  <Form.Item
                     label="Full name"
                     name="name"
                     rules={[
                        {
                           required: true,
                           message: 'Please input your name!',
                        },
                     ]}
                  >
                     <Input placeholder="Example@company.com" className="form__container-input" />
                  </Form.Item>

                  <Form.Item
                     name="password"
                     label="Password"
                     rules={[
                        {
                           required: true,
                           message: 'The input is not valid password!',
                        },
                     ]}
                  >
                     <Input
                        type="password"
                        placeholder="Example@company.com"
                        className="form__container-input"
                     />
                  </Form.Item>
                  <Form.Item>
                     <Button
                        size="large"
                        type="primary"
                        htmlType="submit"
                        className="form__container-btn"
                     >
                        <span>Register</span>
                        <ArrowRightOutlined />
                     </Button>
                  </Form.Item>
                  <div className="suggest__signup-wrapper">
                     <div className="suggest__signup-support">
                        <span>Already have an account?</span>
                        <Link to="/login" className="suggest__signup-link">
                           <span>login</span>
                        </Link>
                     </div>
                  </div>
               </Form>
            </div>
         </Col>
         <Col span={10}>
            <div className="img__wrapper">
               <div
                  className="img__banner"
                  style={{
                     backgroundImage: `url(${ImgBanner})`,
                  }}
               ></div>
            </div>
         </Col>
         {infoNotifi.isOpen && (
            <Notification
               info={infoNotifi.info}
               description={infoNotifi.description}
               placement={infoNotifi.placement}
            />
         )}
      </Row>
   );
};

export default Register;
