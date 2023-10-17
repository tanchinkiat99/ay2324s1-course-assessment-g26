//user-service/frontend/pages/profile.js
import { useSession } from 'next-auth/react';
import PrivateRoute from "@app/api/auth/[...nextauth]/PrivateRoute";
import React, { useState } from 'react';
import axios from 'axios';

const Profile = () => {
    const { data: session, update } = useSession();

    if (!session) return null;

    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState('');

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancelClick = () => {
        setIsEditing(false);
    };

    const handleNameChange = (e) => {
        setNewName(e.target.value);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            // Send a request to the backend to update the profile
            const response = await axios.put('localhost:3001/api/updateProfile', {
                email: session.user.email,
                newName: newName
            });

            if (response.status === 200) {
                update({name: newName});
                console.log('Profile updated successfully');
            }
        } catch (error) {
            console.error('An error occurred while updating the profile:', error);
        }
    };

    return (
        <div>
            <div>
                <h1>Welcome, {session.user.name}</h1>
                <p>Email: {session.user.email}</p>
                <img src={session.user.image} alt="User avatar" />
                {/* todo:Add in additional user data later */}
            </div>

            {!isEditing ? (
                <button onClick={handleEditClick}>Edit Profile</button>
            ) : (
                <form onSubmit={handleFormSubmit}>
                    <input type="text" value={newName} onChange={handleNameChange} placeholder="New Name" />
                    <button type="submit">Save Changes</button>
                    <button type="button" onClick={handleCancelClick}>Cancel</button>
                </form>
            )}
        </div>
    );
};

export default PrivateRoute(Profile);

