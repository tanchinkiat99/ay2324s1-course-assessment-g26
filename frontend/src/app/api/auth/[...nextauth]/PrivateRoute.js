import { getSession, useSession } from 'next-auth/react';
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const PrivateRoute = (Component) => {
    return (props) => {
        const { data: session, status } = useSession();
        const router = useRouter();

        useEffect(() => {
            if (status === "loading") return; // Wait for session to load
            if (!(status === 'authenticated')) {
                router.push('/');
            }

        }, [status, router]);

        if (!(status === 'authenticated')) {
            return <p>You must be logged in to view this page.</p>;
        }

        return <Component {...props} />;
    };
}

const MaintainerRoute = (Component) => {
  return (props) => {
    const { data: session, status } = useSession();

    if (!(status === 'authenticated')) {
      return <p>You must be logged in to view this page.</p>;
    }

    if (!(session.user.role_type === 'maintainer')) {
      return <p>You must be authorised to view this page.</p>;
    }

    return <Component {...props} />;
  };
};

export const getServerSideProps = async (context) => {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: '/',
      },
    };
  }
  return {
    props: { session },
  };
};

export default PrivateRoute;
