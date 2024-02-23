'use client'
import React from 'react';
import { Button, Form, Input, Row, Col, Divider } from 'antd';
import Link from 'next/link';
import { signIn } from 'next-auth/react';


type FieldType = {
    username?: string;
    password?: string;
};

const AuthSignIn = () => {
    const [form] = Form.useForm();

    const onFinish = async () => {
        const res = await signIn("credentials", {
            username: form.getFieldValue('username'),
            password: form.getFieldValue('password'),
            redirect: false
        })

        if (!res?.error) {
            window.location.href = "/"
        } else {
            alert(res.error)
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <Row justify="center" align="middle" style={{ minHeight: '100%', overflowX: 'hidden' }}>
            <Col xs={22} sm={20} md={15} lg={12} xl={10}
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                <Form
                    form={form}
                    layout='vertical'
                    style={{
                        maxWidth: '500px',
                        width: '100%', // Đảm bảo Form chiếm toàn bộ chiều rộng của Col
                        padding: '10px 30px 10px 30px',
                        boxSizing: 'border-box', // Đảm bảo padding và border không làm tăng kích thước tổng thể của Form
                        backgroundColor: '#191919',
                        borderRadius: '20px',
                        boxShadow: '0 0 10px 0 black' /* Đổ bóng với độ sâu 2px và màu đen có độ trong suốt 10% */

                    }}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item style={{ display: 'flex', justifyContent: 'left', margin: '0px' }}>
                        <h1
                            style={{ fontSize: 20, color: '#dfdfdf' }}
                        >
                            Đăng nhập
                        </h1>
                    </Form.Item>

                    <Form.Item<FieldType>
                        label={<span style={{ fontSize: 16, fontWeight: 'bold', color: '#dfdfdf' }}>Email</span>}
                        name="username"
                        rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                        <Input size='large' />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label={<span style={{ fontSize: 16, fontWeight: 'bold', color: '#dfdfdf' }}>Password</span>}
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                        style={{ marginBottom: '5px' }}
                    >
                        <Input.Password size='large' />
                    </Form.Item>

                    <Form.Item style={{ display: 'flex', justifyContent: 'right', marginBottom: '20px' }}>
                        <Link
                            href='#'
                            style={{ fontSize: 14, fontStyle: 'italic', textDecoration: 'underline', color: '#1777ff' }}
                        >
                            Quên mật khẩu?
                        </Link>
                    </Form.Item>

                    <Form.Item style={{ marginBottom: '5px' }}>
                        <Button type="primary" htmlType="submit" block
                            style={{
                                height: '40px', // hoặc bất kỳ độ cao nào bạn muốn
                                fontWeight: 'bold', // làm chữ đậm
                                fontSize: 17,
                            }}
                        >
                            Đăng nhập
                        </Button>
                    </Form.Item>

                    <Divider style={{ color: '#dfdfdf', borderColor: '#dfdfdf', fontSize: '14px', margin: '0px' }}>
                        Hoặc
                    </Divider>

                    <Form.Item style={{ marginTop: '5px', marginBottom: '0px' }}>
                        <Button
                            block
                            style={{
                                height: '40px', // hoặc bất kỳ độ cao nào bạn muốn
                                fontWeight: 'bold', // làm chữ đậm
                                fontSize: 17,
                                backgroundColor: '#dfdfdf'
                            }}
                        >
                            Sử dụng phiên bản miễn phí
                        </Button>
                    </Form.Item>

                    <Form.Item style={{ display: 'flex', justifyContent: 'center', alignItems: 'middle', marginBottom: '0px' }}>
                        <p style={{ fontSize: 13, color: '#dfdfdf' }}>
                            Bạn chưa có tài khoản?&nbsp;
                            <Link
                                href="#"
                                style={{ fontSize: 14, color: '#1777ff' }}
                            >
                                Đăng kí
                            </Link>
                        </p>
                    </Form.Item>
                </Form>
            </Col>
        </Row>
    )
};

export default AuthSignIn;