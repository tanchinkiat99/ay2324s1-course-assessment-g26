'use client';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import PrivateRoute from '@app/api/auth/[...nextauth]/PrivateRoute';
import { updateUser } from '@app/api/userService';
//import { useRouter } from 'next/authentication';

import Profile from '@components/Profile';

const ProfilePage = () => {
  const { data: session } = useSession();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: session?.user.name || '',
    email: session?.user.email,
  });
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    try {
      session.user.name = formData.name;
      const res = await updateUser(formData.email, formData.name);
      if (res.status === 200) {
        setErrorMessage(null);
        setSuccessMessage('Profile updated successfully');
        setEditMode(false);
      }
    } catch (error) {
      setSuccessMessage(null);
      setErrorMessage(error.response?.data || 'An error occurred');
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col items-center w-full h-screen p-8">
      <h1 className="text-4xl mb-6">Profile</h1>
      <div className="flex flex-col items-center w-1/2">
        <Image
          className="rounded-full mb-4"
          src={session?.user.image}
          width={60}
          height={60}
        />
        {editMode ? (
          <>
            <input
              className="search_input mb-4"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
            <button className="black_btn mb-4" onClick={handleSubmit}>
              Save
            </button>
          </>
        ) : (
          <>
            <p className="text-xl mb-4">{`Name: ${session?.user.name}`}</p>
            <p className="text-xl mb-4">{`Email: ${session?.user.email}`}</p>
          </>
        )}
        <button
          className={editMode ? 'outline_btn' : 'black_btn'}
          onClick={() => setEditMode(!editMode)}
        >
          {editMode ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>
    </div>
  );
};
export default PrivateRoute(ProfilePage);
