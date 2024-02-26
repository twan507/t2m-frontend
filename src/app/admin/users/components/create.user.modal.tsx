'use client'
import { sendRequest } from '@/utlis/api';
import { Modal, Input, notification, Form, Select, InputNumber } from 'antd';
import { RuleObject } from 'antd/es/form';
import { useSession } from 'next-auth/react';
const { Option } = Select;

interface IProps {
    getData: any
    isCreateModalOpen: boolean
    setIsCreateModalOpen: (v: boolean) => void
}

const CreateUserModal = (props: IProps) => {

    const { data: session } = useSession()

    const { getData, isCreateModalOpen, setIsCreateModalOpen } = props

    // Hàm kiểm tra Sponsors Code 
    const validSponsorsCode = ["VIP001", "VIP002", "VIP003"]
    const validateSponsorsCode = (_: RuleObject, value: string) => {
        if (!value || validSponsorsCode.includes(value)) {
            return Promise.resolve();
        }
        return Promise.reject(new Error('Sponsors Code không tồn tại!'));
    };

    //Hàm kiểm tra email
    const validateEmail = async (_: RuleObject, value: string) => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (value && !emailRegex.test(value)) {
            throw new Error('Email không đúng định dạng.');
        }
    };

    //Hàm kiểm tra số điện thoại
    const validatePhoneNumber = async (_: RuleObject, value: string): Promise<void> => {
        const phoneRegex = /^0\d{9}$/;
        if (!value || phoneRegex.test(value)) {
            return;
        }
        throw new Error('Số điện thoại không đúng.');
    };

    //Hàm kiểm tra mật khẩu
    const validatePassword = async (_: RuleObject, value: string) => {
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;
        if (value && !passwordRegex.test(value)) {
            throw new Error('Mật khẩu phải dài tối thiểu 6 kí tự, bao gồm 1 chữ cái in hoa và 1 chữ số');
        }
    };

    const onFinish = async (values: any) => {
        const { name, email, password, phoneNumber, affiliateCode, sponsorCode, role } = values
        const data = { name, email, password, phoneNumber, affiliateCode, sponsorCode, role }

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
            title="Tạo mới người dùng"
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
                <Form.Item
                    style={{ marginBottom: "5px" }}
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: 'Email không được để trống!' },
                        { validator: validateEmail }
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
                        { validator: validatePassword }
                    ]}
                >
                    <Input.Password placeholder="Password tối thiểu 6 kí tự, bao gồm 1 chữ in hoa và 1 chữ số" />
                </Form.Item>

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
                    label="PhoneNumber"
                    name="phoneNumber"
                    rules={[
                        { required: true, message: 'Số điện thoại không được để trống!' },
                        { validator: validatePhoneNumber }
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
                        allowClear
                    >
                        <Option value="NORMAL_USER">USER</Option>
                        <Option value="SUPER_ADMIN">ADMIN</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    style={{ marginBottom: "5px" }}
                    name="affiliateCode"
                    label="Mã CTV"
                >
                    <Input placeholder="Nhập mã cộng tác viên (Nếu có)" style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item
                    style={{ marginBottom: "5px" }}
                    name="sponsorCode"
                    label="Mã giới thiệu"
                    rules={[{ validator: validateSponsorsCode }]}
                >
                    <Input placeholder="Nhập mã giới thiệu (Nếu có)" style={{ width: "100%" }} />
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default CreateUserModal