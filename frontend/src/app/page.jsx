'use client';

import QuestionsList from '@components/QuestionsList';
import { useState, useEffect } from 'react';
import { signIn, useSession, getProviders } from 'next-auth/react';

const Home = () => {
  const { data: session } = useSession();
  // console.log(session);
  // console.log('JWT:', session?.accessToken);
  // console.log(session?.accessToken);
  const [providers, setProviders] = useState(null);

  useEffect(() => {
    const setupProviders = async () => {
      const response = await getProviders();
      setProviders(response);
    };
    setupProviders();
  }, []);

  return (
    <section className="w-full">
      <h1 className="text-center text-5xl">
        PeerPrep
        <br className="max-md:hidden" />
        <span className="text-2xl">
          Practice technical interviews with your peers
        </span>
      </h1>
      {session?.user ? (
        <>
          <p className="desc text-center">
            Browse the questions here and get matched
          </p>
          <QuestionsList role_type={session?.user.role_type} />
        </>
      ) : (
        <div className="flex flex-col items-center">
          {providers &&
            Object.values(providers).map((provider) => (
              <button
                type="button"
                key={provider.name}
                onClick={() => signIn(provider.id)}
                className="big_btn"
              >
                Sign In with Google
              </button>
            ))}
        </div>
      )}
    </section>
  );
};

export default Home;
