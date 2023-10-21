// Set up providers here
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
// Import SQL connectDB from database.js here after SQL database is set up

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session }) {
      // TODO: find user from SQL database where email == user.session.email
      // TODO: Set session.user.id to the id string of the user retrieved so it can be used in the session
      return session;
    },
    async signIn({ profile }) {
      try {
        // SQL user database only
        // TODO: Check if user already exists
        // TODO: If not, create new user and save in database
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
  },
});

export { handler as GET, handler as POST };
