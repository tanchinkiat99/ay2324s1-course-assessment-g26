'use client'
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { signIn, signOut, useSession, getProviders } from 'next-auth/react';

const Nav = () => {
  return (
    <nav className="flex-between w-full mb-16 pt-3">
      <Link href="/" className="flex gap-2 flex-center">
        <Image className="object-contain" src="/logo.svg" width={50} height={50}/>
        <p className="max-sm:hidden font-satoshi font-semibold text-lg text-black tracking-wide">PeerPrep</p>
      </Link>
    </nav>
  );
}

export default Nav;