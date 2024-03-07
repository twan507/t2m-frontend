import NextAuth, { DefaultSession } from 'next-auth';
import { JWT } from "next-auth/jwt"

interface IUser {
    _id: string;
    email: string;
    name: string;
    phoneNumber: string;
    affiliateCode: string;
    licenseInfo: {
        daysLeft: number,
        product: string,
        accessLevel: number
    },
    role: string;
}

declare module 'next-auth' {
    interface Session {
        access_token: string;
        user: IUser
        limit: boolean
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        access_token: string;
        user: IUser
        limit: boolean
    }
}