import dotenv from "dotenv";
import express from "express";
import { updateUserName } from '../database.js';

dotenv.config();
const router = express.Router();
router.put('/edit', async (req, res) => {
    const { email, name } = req.body;

    try {
        // Validate incoming data (more validation for production to prevent SQL injection)
        if (!email || !name) {
            console.log("User:", email, "missing required fields");
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Update name in the database
        const isUpdated = await updateUserName(email, name);

        if (isUpdated) {
            console.log("User:", email, "updated successfully")
            return res.status(200).json({ message: 'Profile updated successfully' });
        } else {
            console.log("User:", email, "not found")
            return res.status(404).json({error: 'User not found'});
        }

        } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;