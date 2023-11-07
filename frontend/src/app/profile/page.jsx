'use client';
import Image from 'next/image';
import {signOut, useSession} from 'next-auth/react';
import { useState, useEffect } from 'react';
import PrivateRoute from '@app/api/auth/[...nextauth]/PrivateRoute';
import {deleteUser, updateUser} from '@app/api/userService';
//import { useRouter } from 'next/authentication';

import Profile from '@components/Profile';

const ProfilePage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  // States to control display of edit form
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: session?.user.name || '',
    email: session?.user.email,
  });
  // State to control the display of the confirmation dialog for deleting profile
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  // States to control message dialogues (not in use)
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
  const handleDeleteClick = () => {
    // This will display the confirmation dialog
    setIsDeleteConfirmationOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await deleteUser(session.user.email);
      console.log(response);
      signOut().then(() => {
        router.push("/"); // Redirect to the index page
      });
    } catch (error) {
      // Handle any errors that occur during deletion
      setErrorMessage('Failed to delete profile: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsDeleteConfirmationOpen(false);
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

      {/* Delete profile text */}
      <span
          className="cursor-pointer text-red-600 hover:text-red-700 mt-4"
          onClick={handleDeleteClick}
      >
        Delete Profile
      </span>

      {/* Confirmation dialog */}
      {isDeleteConfirmationOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow-md">
              <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
              <p>Are you sure you want to delete your profile? This action cannot be undone.</p>
              <div className="flex justify-between mt-6">
                <button
                    className="px-4 py-2 rounded text-white bg-red-600 hover:bg-red-700"
                    onClick={handleDeleteConfirm}
                >
                  Delete
                </button>
                <button
                    className="px-4 py-2 rounded text-gray-700 bg-gray-200 hover:bg-gray-300"
                    onClick={() => setIsDeleteConfirmationOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
      )}
    </div>
  );
};
export default PrivateRoute(ProfilePage);
