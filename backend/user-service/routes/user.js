import dotenv from "dotenv";
import express from "express";
import { updateUserName } from '../db/controllers/userController.js';
import { checkUserExists } from "../middlewares/userMiddleware.js";
import { body, param, validationResult } from 'express-validator';

dotenv.config();
const router = express.Router();
router.put('/:email', param('email').notEmpty().isEmail().escape(), checkUserExists(),
    body('name').notEmpty().escape(), async (req, res) => {
    const { email, name } = req.body;

    try {
        const validationRes = validationResult(req);
        if (!(validationRes.isEmpty())) { // If validation fails
            res.status(400).json(validationRes.array()); // Return all error messages
        }

        // Update name in the database
        const isUpdated = await updateUserName(email, name);
        if (isUpdated) {
            console.log("User:", email, "updated successfully")
            return res.status(200).json({ message: 'Profile updated successfully' });
        } else {
            console.log("User:", email, "not found") // Redundant error checking
            return res.status(404).json({error: 'User not found'});
        }

        } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;