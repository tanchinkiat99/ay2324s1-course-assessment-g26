//frontend/src/app/api/auth/[...nextauth]/route.js
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/Google';
import axios from 'axios';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  database: process.env.SERVER,

  secret: process.env.JWT_SECRET,
  callbacks: {
    async session({ session, token }) {
      try {
        const user = {
          name: session.user.name,
          email: session.user.email,
          image: session.user.image,
        };
        const res = await axios.post(
          `${process.env.EXPRESS_SERVER}/auth/signin-new`,
          { user: user }
        );
        if (res.status === 200) {
          // Successful request
          session.user.name = res.data.name;
          session.user.image = res.data.image;
          // session.user.role_type = res.data.role_type;
          session.user.role_type = 'maintainer';
        }
        return session;
      } catch (error) {
        console.log(error);
      }
    },
  },
  //todo: Call back for email and password login
});

export { handler as GET, handler as POST };
