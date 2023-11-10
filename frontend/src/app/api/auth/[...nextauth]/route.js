//frontend/src/app/api/auth/[...nextauth]/route.js
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/Google';
import axios from 'axios';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      // Prompts login again, allow for different account
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],
  // database: process.env.SERVER,

  secret: process.env.JWT_SECRET,
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // The user will be passed to jwt on signin
      const user_ = {
        name: user.name,
        email: user.email,
        image: user.image,
      };

      try {
        const res = await axios.post(`${process.env.EXPRESS_SERVER}/auth/signin-new`,
            {
              name: user_.name,
              email: user_.email,
              image: user_.image
            });
        if (res.status === 200) { // Successful request
          user.name = res.data.name;
          user.image = res.data.image;
          user.role_type = res.data.role_type;
        }
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
    async jwt({ token, user, session }) {
      // Only returns user on signin which will be copied to token, subsequent user here is undefined
      // console.log('jwt callback', { token, user, session });
      if (user) {
        // On signin
        return {
          ...token,
          role_type: user.role_type,
        };
      }
      return token;
    },
    async session({ session, token }) {
      session.user.role_type = token.role_type;
      // console.log({ token, session });

      return session;
    },
  },
  //todo: Call back for email and password login
});

export { handler as GET, handler as POST };
