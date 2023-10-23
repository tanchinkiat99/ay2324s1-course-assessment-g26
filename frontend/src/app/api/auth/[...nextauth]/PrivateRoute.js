import {getSession, useSession} from 'next-auth/react';
const PrivateRoute = (Component) => {
    return (props) => {
        const { data: session, status } = useSession();

        if (!(status === 'authenticated')) {
            return <p>You must be logged in to view this page.</p>;
        }

        return <Component {...props} />;
    };
}

export const getServerSideProps = async (context) => {
    const session = await getSession(context)
    if (!session) {
        return {
            redirect: {
                destination: '/login'
            }
        }
    }
    return {
        props: {session},
    };
};

export default PrivateRoute;
