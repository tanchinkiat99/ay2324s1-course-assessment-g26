'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { signIn, signOut, useSession, getProviders } from 'next-auth/react';

const Nav = () => {
    // get session data after signin
    const { data: session } = useSession();
    const [providers, setProviders] = useState(null);
    const renderSignInButtons = () => (
        <>
            {providers &&
                Object.values(providers).map((provider) => (
                    <button
                        type="button"
                        key={provider.name}
                        onClick={() => signIn(provider.id)}
                        className="outline_btn"
                    >
                        Sign In
                    </button>
                ))}
        </>
    );

    const renderUserSessionControls = () => (
        <div className="flex gap-3">
            <Link href="/add-question" className="black_btn">
                Create Question
            </Link>
            <button type="button" onClick={signOut} className="outline_btn">
                Sign Out
            </button>
            <Link href="/profile">
            </Link>
        </div>
    );

    useEffect(() => {
        {/* Fetch providers after loading page */}
        const setupProviders = async () => {
            const response = await getProviders();
            setProviders(response);
        };
        setupProviders();
    }, []);

    return (
        <nav className="flex justify-between w-full mb-16 pt-3">
            <Link href="/" className="flex gap-5 flex-center items-center">
                <p className="logo_txt">PeerPrep</p>
            </Link>
            {/* Show signin and signout */}
            <div className="sm:flex hidden">
                {session?.email ? renderUserSessionControls() : renderSignInButtons()}
            </div>
        </nav>
    );
};

export default Nav;