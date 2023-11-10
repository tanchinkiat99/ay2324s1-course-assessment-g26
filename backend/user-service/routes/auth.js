//backend/user-service/routes/auth.js
import cookie from 'cookie';
import dotenv from 'dotenv';
import express from 'express';
// Middleware
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';

import { getUserCompleteByEmail, insertUser } from '../db/controllers/userController.js';
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

router.post('/signin-new', body(['name', 'email']).notEmpty().escape(), body('image').notEmpty(), body('email').isEmail(),
    async (req, res) => {

    const validationRes = validationResult(req);
    if (!(validationRes.isEmpty())) { // If validation fails
        return res.status(400).json(validationRes.array()); // Return all error messages
    }

    const { name, email, image } = req.body;

    try {
        let user = await getUserCompleteByEmail(email);
        if (!user) {
            const USER_ROLE = 'user'; // Set default user type created as user
            user = await insertUser(email, name, image, USER_ROLE);

            return res.status(200).send({message: `New user ${email} successfully logged in by google`, name: name,
                email: email, image: image, role_type: USER_ROLE});
        }

        res.status(200).send({message: `${user.email} successfully logged in by google`, name: user.name,
            email: user.email, image: user.image, role_type: user.user_role});
    } catch (error) {
        console.log(error);
        res.status(400).json({error: 'Google sign-in failed'});
    }

});

export default router;
