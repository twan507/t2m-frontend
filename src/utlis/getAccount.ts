import { sendRequest } from "./api";

export async function getAccount(access_token: string) {
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/account`,
        headers: { 'Authorization': `Bearer ${access_token}` },
        method: "GET"
    })
    return res?.data
}