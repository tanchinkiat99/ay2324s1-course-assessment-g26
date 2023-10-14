import { useState } from 'react';
import {useSession, signIn, signOut } from 'next-auth/react'
import axios from 'axios';

const LoginPage = () => {
    const {data: session} = useSession()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            await axios.post('/auth/login', { email, password });
            // Handle successful login, e.g., redirect to profile or dashboard
        } catch (err) {
            console.error("Login failed:", err);
        }
    };

    if (session) {
        return (
            <div>
                <p>Hi {session.user.name}</p>
                <p>Logged in as {session.user.email}</p>
                <button onClick={() => signOut()}>Next Auth Logout</button>
            </div>
        );
    } else {
        return (
            <div>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email"/>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                       placeholder="Password"/>
                <button onClick={handleLogin}>Login</button>
                <button onClick={() => signIn()}>Next Auth Login</button>
            </div>
        )
    }
};

export default LoginPage;
