import { JWT } from "next-auth/jwt"
import { sendRequest } from "./api"
import { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
    secret: process.env.NEXT_PUBLIC_AUTH_SECRET,
    providers: [
        CredentialsProvider({
            name: "account",
            // credentials: {
            //     username: { label: "Username", type: "text", placeholder: "Nhập email" },
            //     password: { label: "Password", type: "password" }
            // },
            credentials: {},
            async authorize(credentials, req) {
                //@ts-ignore
                return JSON.parse(credentials?.loginData)
            }
        })
    ],
    session: {
        maxAge: 60 * 60 * 24,
    },
    callbacks: {
        jwt({ token, user, account, profile, trigger }) {

            if (trigger === 'signIn' && account?.provider === "credentials") {
                console.log(user)
                //@ts-ignore
                token.user = user.user
                //@ts-ignore
                token.access_token = user.access_token

            }
            return token
        },
        //@ts-ignore
        async session({ session, token, user }) {

            const sessionLimit = await sendRequest<IBackendRes<JWT>>({
                url: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/session-limit`,
                method: "POST",
                body: {
                    //@ts-ignore
                    email: token.user.email,
                    //@ts-ignore
                    token: token.access_token
                }
            })

            if (token) {
                session.user = token.user
                session.access_token = token.access_token
            }


            if (!sessionLimit.data) {
                return null
            }

            return session
        }
    },
}