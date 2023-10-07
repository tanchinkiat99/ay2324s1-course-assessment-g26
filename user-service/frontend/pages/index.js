//user-service/frontend/components/PrivateRoute.jsx
import { useSession, signIn, signOut } from 'next-auth/react';
import Nav from '@components/Nav.jsx';
import Link from 'next/link';

export default function HomePage() {
    const { data: session } = useSession();

    return (
        <div>
            <main className="container mx-auto p-4">
                <h1 className="text-4xl mb-6">Welcome to PeerPrep</h1>

                {!session ? (
                    <>
                        <p>Please sign in to access PeerPrep.</p>
                        <button
                            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            onClick={() => signIn()}
                        >
                            Sign In
                        </button>
                    </>
                ) : (
                    <>
                        <p>Welcome back, {session.user.name}!</p>
                        <div className="mt-4">
                            <Link href="/profile">
                                <a className="mr-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                                    View/Edit Profile
                                </a>
                            </Link>
                            <button
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                onClick={() => signOut()}
                            >
                                Sign Out
                            </button>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
