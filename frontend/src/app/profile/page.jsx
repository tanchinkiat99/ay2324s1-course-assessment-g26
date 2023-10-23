'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
//import { useRouter } from 'next/authentication';

import Profile from '@components/Profile';

// Reused for own profile and others
const ProfilePage = () => {
  return;
  <Profile name="Mine" />;
};

export default ProfilePage;
