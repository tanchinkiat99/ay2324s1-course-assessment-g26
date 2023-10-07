//user-service/frontend/pages/profile.js
import PrivateRoute from '@pages/api/auth/PrivateRoute';
import { useSession } from 'next-auth/react';

const ProfilePage = () => {
    const { data: session } = useSession();

    if (!session) return null;

    return (
        <div>
            <h1>Welcome, {session.user.name}</h1>
            <p>Email: {session.user.email}</p>
            <img src={session.user.image} alt="User avatar" />
            {/* todo:Add in additional user data later */}
        </div>
    );
}

export default PrivateRoute(ProfilePage);
