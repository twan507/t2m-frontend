import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github"
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
                console.log(res)
                if (res && res.data) {
                    return res.data as any
                } else {
                    throw new Error(res?.message as string)
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user, account, profile, trigger }) {

            if (trigger === 'signIn' && account?.provider === "credentials") {
                //@ts-ignore
                token.tokens = user.tokens
                //@ts-ignore
                token.user = user.user
            }
            return token
        },
        session({ session, token, user }) {
            if (token) {
                session.tokens = token.tokens
                session.user = token.user
            }
            return session
        }
    },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }