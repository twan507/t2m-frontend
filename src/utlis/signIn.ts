import { JWT } from "next-auth/jwt";
import { sendRequest } from "./api";
import { notification } from "antd";

export async function signIn(form: any) {

    const res = await sendRequest<IBackendRes<JWT>>({
        url: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/login`,
        method: "POST",
        body: {
            username: form.getFieldValue('username'),
            password: form.getFieldValue('password')
        }
    })
    if (!res?.error) {
        // window.location.href = "/"
        notification.success({
            message: "Đăng nhập thành công"
        })
        
        return res.data
    } else {
        notification.error({
            message: res.error
        })
    }
}