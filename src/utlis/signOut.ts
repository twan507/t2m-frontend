import { JWT } from "next-auth/jwt";
import { sendRequest } from "./api";
import { notification } from "antd";

export async function signOut(access_token: string) {

    const res = await sendRequest<IBackendRes<JWT>>({
        url: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/logout`,
        headers: { 'Authorization': `Bearer ${access_token}` },
        method: "GET"
    })
    if (!res?.error) {
        // window.location.href = "/"
        notification.success({
            message: "Đăng xuất thành công"
        })

    } else {
        notification.error({
            message: res.error
        })
    }
}