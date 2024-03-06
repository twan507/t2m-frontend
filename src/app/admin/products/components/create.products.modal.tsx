'use client'
import { sendRequest } from '@/utlis/api';
import { Modal, Input, notification, Form, Select, Button } from 'antd';
import { RuleObject } from 'antd/es/form';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
const { Option } = Select;

interface IProps {
    getData: any
    isCreateModalOpen: boolean
    setIsCreateModalOpen: (v: boolean) => void
}

const CreatProductModal = (props: IProps) => {

    const { data: session } = useSession()

    const { getData, isCreateModalOpen, setIsCreateModalOpen } = props

    const onFinish = async (values: any) => {
        console.log(values)

        const { name, email, password, phoneNumber, sponsorCode, role } = values
        const data = { name, email, password, phoneNumber, sponsorCode, role }

        const res = await sendRequest<IBackendRes<any>>({
            url: `http://localhost:8000/api/v1/users`,
            method: "POST",
            headers: { 'Authorization': `Bearer ${session?.access_token}` },
            body: data
        })

        if (res.data) {
            await getData()
            notification.success({
                message: "Tạo mới user thành công"
            })
            handleClose()
        } else {
            notification.error({
                message: "Có lỗi xảy ra",
                description: res.message
            })
        }
    };

    const [form] = Form.useForm()

    const handleClose = () => {
        form.resetFields()
        setIsCreateModalOpen(false)
    }

    return (
        <Modal
            title="Tạo mới sản phẩm"
            open={isCreateModalOpen}
            onOk={() => form.submit()}
            onCancel={handleClose}
            maskClosable={false}>

            <Form
                name="basic"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                layout="vertical"
                form={form}
            >
                {/* Dummy fields */}
                <div style={{ display: 'none' }}>
                    <Input name="username" type="text" autoComplete="username" />
                    <Input name="password" type="password" autoComplete="current-password" />
                </div>

                <Form.Item
                    style={{ marginBottom: "5px" }}
                    label="Tên người dùng"
                    name="name"
                    rules={[{ required: true, message: 'Tên người dùng không được để trống!' }]}
                >
                    <Input placeholder="Nhập tên đầy đủ của người dùng" />
                </Form.Item>

                <Form.Item
                    style={{ marginBottom: "5px" }}
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: 'Email không được để trống!' },
                        // { validator: validateEmail }
                    ]}
                >
                    <Input placeholder="Nhập Email người dùng mới" />
                </Form.Item>

                <Form.Item
                    style={{ marginBottom: "5px" }}
                    label="Password"
                    name="password"
                    rules={[
                        { required: true, message: 'Password không được để trống!' },
                        // { validator: validatePassword }
                    ]}
                >
                    <Input.Password placeholder="Password tối thiểu 6 kí tự, bao gồm 1 chữ in hoa và 1 chữ số" />
                </Form.Item>

                <Form.Item
                    style={{ marginBottom: "5px" }}
                    label="Xác nhận mật khẩu"
                    name="confirmPassword"
                    rules={[
                        { required: true, message: 'Xác nhận mật khẩu không được để trống!' },
                        // { validator: validatePasswordsMatch }
                    ]}
                >
                    <Input.Password placeholder="Xác nhận mật khẩu" />
                </Form.Item>

                <Form.Item
                    style={{ marginBottom: "5px" }}
                    label="Số điện thoại"
                    name="phoneNumber"
                    rules={[
                        { required: true, message: 'Số điện thoại không được để trống!' },
                        // { validator: validatePhoneNumber }
                    ]}
                >
                    <Input placeholder="Nhập số điện thoại người dùng" style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item
                    style={{ marginBottom: "5px" }}
                    name="role"
                    label="Role"
                    rules={[{ required: true, message: 'Role không được để trống!' }]}>
                    <Select
                        placeholder="Chọn Role cho người dùng"
                        defaultValue="T2M USER"
                    >
                        <Option value="T2M USER">USER</Option>
                        <Option value="T2M ADMIN">ADMIN</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    style={{ marginBottom: "5px" }}
                    name="sponsorCode"
                    label="Mã giới thiệu"
                    // rules={[{ validator: validateSponsorsCode }]}
                >
                    <Input placeholder="Nhập mã giới thiệu (Nếu có)" style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item style={{ display: 'none' }}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default CreatProductModal