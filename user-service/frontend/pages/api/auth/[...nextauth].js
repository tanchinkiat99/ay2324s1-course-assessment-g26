//user-service/frontend/pages/api/auth/[...nextauth].js
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/Google'
import axios from "axios";

export default NextAuth({
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            authorize: async (credentials, req) => {
                try {
                    const response = await axios.post(`${process.env.EXPRESS_SERVER}/auth/login`, {
                        email: credentials.email,
                        password: credentials.password,
                    });

                    if (response.data && response.data.user) {
                        return Promise.resolve(response.data.user);
                    } else {
                        throw new Error('User not found');
                    }
                } catch (error) {
                    throw new Error(error.message);
                }
            },
        }),
            GoogleProvider({
                clientId: process.env.GOOGLE_ID,
                clientSecret: process.env.GOOGLE_SECRET
            })
    ],
    database: process.env.SERVER,
    session: {
        jwt: true,
    },
    secret: process.env.JWT_SECRET,
    callbacks: {
        async signIn(user) {
            if (user.account.provider === 'google') {
                console.log(user.account.id_token);
                try {
                    const res = await axios.post(`${process.env.EXPRESS_SERVER}/auth/google-signin`,
                        {idToken: user.account.id_token })
                    if (res.status === 200) {
                        return true;
                    }
                } catch (error) {
                    console.log(error)
                    return false;
                }
            }
            //todo: Call back for email and password login
            return true;
        }
    }
});

/*
*
*     callbacks: {
        async jwt(token, user) {
            if (user) {
                token.email = user.email;
            }
            return token;
        },
        async session(session, token) {
            session.userId = token.id;
            return session;
        },
    },
*/