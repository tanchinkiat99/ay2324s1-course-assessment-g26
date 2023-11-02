//user-service/backend/routes/attemptController.js
import dotenv from 'dotenv';
import express from 'express';
import { addAttempt, getAttemptsByUser } from "../db/controllers/attemptController.js"
import { validateAttemptRequest, checkQuestionExists } from "../middlewares/attemptMiddleware.js";

dotenv.config();
const router = express.Router();

// Create new question attempt by a user (A user is uniquely identified by their email)
router.post('/:email', validateAttemptRequest, checkQuestionExists, async (req, res) => {
    try {
        const { email, question_id, question_title, code} = req.body;
        const result = await addAttempt(email, question_id, question_title, code);
        res.status(200).json({...result, message: `Attempt for question $\{question_id} by ${email} created successfully`})
    } catch (error) {
        console.log(error);
        res.status(502).json({message: 'Internal Server Error'});
    }
});

// Get all attempts by a user
router.get('/:email', async (req, res) => {
    try {
        const result = await getAttemptByUser(email);
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(502).json({message: 'Internal Server Error'});
    }
});

export default router;