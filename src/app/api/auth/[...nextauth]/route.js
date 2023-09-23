// Set up providers here
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
// Import connectToDB here after SQL database is set up

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  ],
  async session({ session }) {

  },

  async signIn({ profile }) {
    try {
      // SQL user database only
      await connectToDB();
      // TODO: Check if user already exists 
      // TODO: If not, create new user and save in database
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
});

export {handler as GET, handler as POST };
