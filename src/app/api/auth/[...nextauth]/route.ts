import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { AuthOptions } from "next-auth";
import { sendRequest } from "@/utlis/api";
import { JWT } from "next-auth/jwt";

export const authOptions: AuthOptions = {
    secret: process.env.AUTH_SECRET,
    providers: [
        CredentialsProvider({
            name: "account",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "Nhập email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {

                const res = await sendRequest<IBackendRes<JWT>>({
                    url: "http://localhost:8000/api/v1/auth/login",
                    method: "POST",
                    body: {
                        username: credentials?.username,
                        password: credentials?.password
                    }
                })
                if (res && res.data) {
                    return res.data as any
                } else {
                    throw new Error(res?.message as string)
                }
            }
        })
    ],
    session: {
        maxAge: 60*60*24,
    },
    callbacks: {
        jwt({ token, user, account, profile, trigger }) {

            if (trigger === 'signIn' && account?.provider === "credentials") {

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
                url: "http://localhost:8000/api/v1/auth/session-limit",
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

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }