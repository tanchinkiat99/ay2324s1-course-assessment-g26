import Link from 'next/link';
import Nav from '../components/Nav.jsx'
import {useRouter} from 'next/router';
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

const HomePage = () => {
    const {data: session} = useSession()
    const router = useRouter();

    return (
        <>
            <h1>Welcome to Peer Prep</h1>
            {session ? renderUserSession(session) : renderSignInButtons()}
            </>
    );
};

export default HomePage;
