"use client"
import QuestionsList from '@components/QuestionsList';
import {signIn, signOut, useSession} from 'next-auth/react'

const renderSignInButtons = () => (
    <button onClick={() => signIn()}>Sign In with NextAuth</button>
)

const renderUserSession = (session) => (
    <div>
        <p>Hi {session.user.name}</p>
        <p>Logged in as {session.user.email}</p>
        <button onClick={() => signOut()}>Sign Out</button>
    </div>
);

const Home = () => {

    const {data: session} = useSession();

    return (
        <>
            <section className="w-full flex-center flex-col">
              <h1 className="text-center text-5xl">
                PeerPrep
                <br className="max-md:hidden" />
                <span className="text-2xl">
                  Practice technical interviews with your peers
                </span>
              </h1>
              <p className="desc text-center">
                Browse the questions here and get matched
              </p>
              <QuestionsList />
            </section>

            {session ? renderUserSession(session) : renderSignInButtons()}
        </>
  );
};

export default Home;
