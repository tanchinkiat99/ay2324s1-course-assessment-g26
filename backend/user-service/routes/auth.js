//user-service/backend/routes/auth.js
import cookie from 'cookie';
import dotenv from 'dotenv';
import express from 'express';
import jwt from 'jsonwebtoken';
import { getUserByEmail, getUserCompleteByEmail, getUserPasswordByEmail, insertUser, hashPassword, validatePassword, updateUserName } from '../database.js';
import { OAuth2Client } from 'google-auth-library';

dotenv.config();
const router = express.Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Create a JWT token
function createToken(payload) {
    return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '1h' });
}

const verifyTokenFromCookie = (req, res, next) => {
    const token = req.cookies.auth;
    if (!token) return res.status(401).send('Access Denied');

    try {
        const verified = jwt.verify(token, process.env.SECRET_KEY);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).send('Invalid Token');
    }
};

router.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
    }

    if (!email || !password) {
        return res.status(400).json({error: "Invalid sign up information provided." })
    }
    const newUser = await insertUser(email, password, 'user');
    const token = createToken({ email: email , role_type: 'user' });

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

    const token = createToken({ email: email, role_type: user.role_type}); // Todo (only if using): Check whether role_type can be accessed in this line

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

router.post('/signin-new', async (req, res) => {

    const {name, email, image} = req.body.user;

    try {
        let user = await getUserCompleteByEmail(email);
        if (!user) {
            const userRole = 'user'; // Set default user type created as user
            user = await insertUser(email, name, image, userRole);
        }

        res.status(200).send({message: 'Login via Google successful', name: user.name,
            email: user.email, image: user.image, role_type: user.user_role});
    } catch (error) {
        console.log(error);
        res.status(400).json({error: 'Google sign-in failed'});
    }

});

router.post('/google-signin', async (req, res) => {
    const { idToken} = req.body;

    try {
        const ticket = await googleClient.verifyIdToken({
            idToken: idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const email = payload.email;
        const name = payload.name;

        let user = await getUserCompleteByEmail(email); // Check whether user exists in database
        if (!user) {
            // Determine the role based on the request body (not in use – currently defaulting to user)
            const userRole = 'user';
            user = await insertUser(email, name,null, payload.sub, 'google', userRole);
        }

        const token = createToken({email: email, role_type: user.role_type });

        res.setHeader('Set-Cookie', cookie.serialize('auth', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'strict',
            maxAge: 3600,
            path: '/',
        }));

        res.status(200).send({message: 'Login via Google successful', name: user.name,
            role_type: user.role_type});

    } catch (error) {
        console.log(error)
        res.status(400).json({error: 'Google sign-in failed'});
    }
});

export default router;