'use client';

import QuestionsList from '@components/QuestionsList';
import Matching from '@components/Matching';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, useSession, getProviders } from 'next-auth/react';

const Home = () => {
  const { data: session } = useSession();
  const [providers, setProviders] = useState(null);
  const router = useRouter();

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
          <QuestionsList role={session?.user.role} />
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
                Sign In
              </button>
            ))}
        </div>
      )}
    </section>
  );
};

export default Home;
