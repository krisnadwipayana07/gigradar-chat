import { UMI_APP_USER_SERVICE_API } from '@/libs/config';
import { Button, Checkbox, Form, FormProps, Input, notification } from 'antd';
import Title from 'antd/es/typography/Title';
import axios from 'axios';
import React from 'react';
import { history } from 'umi';

type FieldType = {
  username?: string;
  password?: string;
  email?: string;
};

export default function index() {
  const [api, contextHolder] = notification.useNotification();
  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    axios
      .post(UMI_APP_USER_SERVICE_API + '/user', values)
      .then((res) => {
        api.info({ message: res.data.message });
        history.push('/auth');
      })
      .catch((err) => {
        console.log(err);
        api.error({ message: err.response.data.message });
      });
  };

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (
    errorInfo,
  ) => {
    console.log(errorInfo);
    // api.error({ message: errorInfo });
  };
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        justifyItems: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      {contextHolder}
      <Title>Register</Title>
      <Form
        name="basic"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <label>Username</label>
        <Form.Item<FieldType>
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input />
        </Form.Item>
        <label>Email</label>
        <Form.Item<FieldType>
          name="email"
          rules={[
            {
              required: true,
              pattern: /\S+@\S+\.\S+/,
              message: 'Please input correct email!',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <label>Password</label>
        <Form.Item<FieldType>
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password />
        </Form.Item>

        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
}
