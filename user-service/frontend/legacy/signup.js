import { useState } from 'react';
import axios from 'axios';

const SignupPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignup = async () => {
        try {
            await axios.post('/auth/signup', { email, password });
            // Handle successful signup, e.g., redirect to profile or dashboard
        } catch (err) {
            console.error("Signup failed:", err);
        }
    };

    return (
        <div>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
            <button onClick={handleSignup}>Signup</button>
        </div>
    );
};

export default SignupPage;
