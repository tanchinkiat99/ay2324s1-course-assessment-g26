import cookie from 'cookie';
import dotenv from 'dotenv';
import express from 'express';
import jwt from 'jsonwebtoken';
import { getUserByEmail, getUserCompleteByEmail, getUserPasswordByEmail, insertUser, hashPassword, validatePassword } from '../database.js';
import { OAuth2Client } from 'google-auth-library';

dotenv.config();
const router = express.Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Create a JWT token
function createToken(payload) {
    return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '1h' });
}
router.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
    }

    if (!email || !password) {
        return res.status(400).json({error: "Invalid sign up information provided." })
    }
    const newUser = await insertUser(email, password);
    const token = createToken({ email: email });

    res.setHeader('Set-Cookie', cookie.serialize('auth', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 3600,
        path: '/'
    }));

    res.status(200).json({ message: 'Signup successful' });
});

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    const user = await getUserCompleteByEmail(email);
    if (!user) {
        return res.status(400).json({ error: 'User does not exist' });
    }

    const isValid = await validatePassword(password, user.password_hash);
    if (!isValid) {
        return res.status(400).json({ error: 'Invalid password' });
    }

    const token = createToken({ email: email });

    res.setHeader('Set-Cookie', cookie.serialize('auth', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 3600,
        path: '/'
    }));

    res.status(200).json({ message: 'Login successful' });
});

router.post('/signout', (req, res) => {
    res.setHeader('Set-Cookie', cookie.serialize('auth', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: -1,
        path: '/'
    }));

    res.status(200).json({ message: 'Logged out' });
});

router.post('/google-signin', async (req, res) => {
    const {idToken} = req.body;

    try {
        const ticket = await googleClient.verifyIdToken({
            idToken: idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const email = payload.email;
        const name = payload.name;

        let user = await getUserByEmail(email); // Check whether user exists in database
        if (!user) {
            user = await insertUser(email, name,null, payload.sub, 'google');
        }

        const token = createToken({email: email});

        res.setHeader('Set-Cookie', cookie.serialize('auth', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'strict',
            maxAge: 3600,
            path: '/',
        }));

        res.status(200).json({message: 'Login via Google successful'});

    } catch (error) {
        console.log(error)
        res.status(400).json({error: 'Google sign-in failed'});
    }
});

export default router;