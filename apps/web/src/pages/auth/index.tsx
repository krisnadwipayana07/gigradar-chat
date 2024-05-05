import { Button, Divider, Flex, Input, notification } from 'antd';
import React, { useState } from 'react';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import axios from 'axios';
import { NavLink, history } from 'umi';
import Title from 'antd/es/typography/Title';
import { UMI_APP_AUTH_SERVICE_API } from '@/libs/config';

export default function index() {
  const [api, contextHolder] = notification.useNotification();
  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    axios
      .post(UMI_APP_AUTH_SERVICE_API + '/auth', loginData)
      .then((res) => {
        sessionStorage.setItem('username', res.data.data.username);
        sessionStorage.setItem('token', res.data.data.token);
        history.push('/');
      })
      .catch(async (err) => {
        console.log(err);
        api.error({ message: err.response.data.message ?? err.message });
      });
  };
  return (
    <Flex justify="center" align="center" style={{ height: '100vh' }}>
      {contextHolder}
      <div style={{ border: '1px solid', padding: '2em' }}>
        <Title style={{ textAlign: 'center' }}>Login</Title>
        <Divider />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          <label>Username</label>
          <Input
            name="username"
            type="text"
            placeholder="Username"
            value={loginData.username}
            onChange={(e) => handleChange(e)}
          />
          <label>Password</label>
          <Input.Password
            name="password"
            placeholder="input password"
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
            value={loginData.password}
            onChange={(e) => handleChange(e)}
          />
          <NavLink to="/register">Not Have Account?</NavLink>
          <Button onClick={handleSubmit}>Login</Button>
        </div>
      </div>
    </Flex>
  );
}
