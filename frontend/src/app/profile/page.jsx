'use client';
import Image from "next/image"
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import axios from 'axios';
import PrivateRoute from "@app/api/auth/[...nextauth]/PrivateRoute";

const ProfilePage = () => {
  const {data: session} = useSession();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: session?.user.name || '',
    email: session?.user.email,
  });
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    try {
      console.log(formData);
      const res = await axios.put(`${process.env.EXPRESS_SERVER}/user/edit`, formData);
      if (res.status === 200) {
        setErrorMessage(null);
        setSuccessMessage('Profile updated successfully');
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
              className={editMode ? "outline_btn" : "black_btn"}
              onClick={() => setEditMode(!editMode)}
          >
            {editMode ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>
      </div>
  );
};
export default PrivateRoute(ProfilePage);
