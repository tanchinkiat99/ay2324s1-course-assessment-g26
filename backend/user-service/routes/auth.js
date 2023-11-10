//backend/user-service/routes/auth.js
import dotenv from 'dotenv';
import express from 'express';
// Middleware
import { body, validationResult } from 'express-validator';
// Controllers
import { getUserCompleteByEmail, insertUser } from '../db/controllers/userController.js';

dotenv.config();
const router = express.Router();

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
            await insertUser(email, name, image, USER_ROLE);

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
