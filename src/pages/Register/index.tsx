import './_register.scss';
import { Row, Col } from 'antd';
import { Button, Form, Input } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ImgBanner from '~/assets/images/register/welcome-to-monday.jpg';
import axios from 'axios';
import Notification, { Info } from '~/components/Notification';
import { useEffect, useState } from 'react';
import { NotificationPlacement } from 'antd/es/notification/interface';
import { useAppDispatch, useAppSelector } from '~/config/store';
import { registerAccount } from '~/shared/reducers/user.reducer';
import VerifyEmail from '~/components/VerifyEmail/verifyEmail';

export interface IDataLogin {
   email: string;
   password: string;
}

interface IDataRegister extends IDataLogin {
   name: string;
}
export interface IInfoNotifi {
   isOpen: boolean;
   info: Info;
   description: string;
   placement: NotificationPlacement;
}

const Register = () => {
   const baseUrl = process.env.REACT_APP_SERVER_API_URL;
   const navigate = useNavigate();
   const dispatch = useAppDispatch();
   const messageRegister = useAppSelector((state) => state.userSlice.user.mess);
   const errRegister = useAppSelector((state) => state.userSlice.user.error);
   const infoAuthUser = useAppSelector((state) => state.userSlice.user);
   const { verification } = useParams();
   const [navigateEmail,setNavigateEmail] = useState('')
   const [infoNotifi, setInfoNotifi] = useState<IInfoNotifi>({
      isOpen: false,
      info: Info.Open,
      description: '',
      placement: 'topRight',
   });

   useEffect(() => {
      let timerId: NodeJS.Timeout;
      if (infoAuthUser.status === 'success' && !infoAuthUser.data?.user) {
         // console.log("infoAuthUser",infoAuthUser.data?.user.email);
         setTimeout(() => {
            navigate('/register/verification',{
               state:{
                  email: navigateEmail
               }
            });
         },500)
      } else if (infoAuthUser.status === 'success' && infoAuthUser.data?.user) {
         timerId = setTimeout(() => {
            navigate('/');
         }, 1000);
      }
      return () => clearTimeout(timerId);
   }, [infoAuthUser.data, infoAuthUser.status]);

   const onFinish = async (values: IDataRegister) => {
      if (values.email && values.password && values.name) {
         dispatch(registerAccount(values));
         setNavigateEmail(values.email)
         
      }
   };
   return (
      <Row>
         <Col span={14}>
            <div className="form__register">
               {verification === 'verification' ? (
                  <VerifyEmail />
               ) : (
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
                        <Input
                           placeholder="Example@company.com"
                           className="form__container-input"
                        />
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
                        <Input
                           placeholder="Example@company.com"
                           className="form__container-input"
                        />
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
               )}
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
