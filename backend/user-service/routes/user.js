//backend/user-service/routes/user.js
import dotenv from "dotenv";
import express from "express";
import { updateUserName, deleteUser } from '../db/controllers/userController.js';
import { checkUserExists } from "../middlewares/userMiddleware.js";
import { body, param, validationResult } from 'express-validator';

dotenv.config();
const router = express.Router();
router.put('/:email', param('email').notEmpty().isEmail().escape(), checkUserExists(),
    body('name').notEmpty().escape(), async (req, res) => {
    const { name } = req.body;
    const { email } = req.params;
    console.log(`Received request to update user ${email}'s name to ${name}`);

    try {
        const validationRes = validationResult(req);
        if (!(validationRes.isEmpty())) { // If validation fails
            res.status(400).json(validationRes.array()); // Return all error messages
        }

        // Update name in the database
        const isUpdated = await updateUserName(email, name);
        if (isUpdated) {
            console.log("User:", email, "updated successfully")
            res.status(200).json({ message: 'Profile updated successfully' });
        } else {
            console.log("User:", email, "not found") // Redundant error checking
            res.status(404).json({error: 'User not found'});
        }

        } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.delete('/:email', param('email').notEmpty().isEmail().escape(), checkUserExists(),
    async (req, res) => {
        const { email } = req.params;
        console.log(`Received request to delete user ${email}`);

        try {
            const validationRes = validationResult(req);
            if (!(validationRes.isEmpty())) { // If validation fails
                res.status(400).json(validationRes.array()); // Return all error messages
            }

            // Update name in the database
            const isDeleted = await deleteUser(email);
            if (isDeleted) {
                console.log("User:", email, "deleted successfully")
                res.status(200).json({ message: 'Profile deleted successfully' });
            } else {
                console.log("User:", email, "not found") // Redundant error checking
                res.status(404).json({error: 'User not found'});
            }

        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    });

export default router;