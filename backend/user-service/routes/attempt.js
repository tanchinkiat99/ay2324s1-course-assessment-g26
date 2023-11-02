//user-service/backend/routes/attemptController.js
import dotenv from 'dotenv';
import express from 'express';
import { addAttempt, getAttemptsByUser } from "../db/controllers/attemptController.js"
import { body, param, validationResult } from 'express-validator';
import { checkUserExists } from "../middlewares/userMiddleware.js";
import { checkQuestionExists } from "../middlewares/attemptMiddleware.js";

dotenv.config();
const router = express.Router();

// Create new question attempt by a user (A user is uniquely identified by their email)
router.post('/:email', param('email').isEmail().escape(), body(['question_id', 'question_title', 'code']).notEmpty().escape(),
    checkUserExists(), checkQuestionExists(), async (req, res) => {
        try {
            const validationRes = validationResult(req);
            if (!(validationRes.isEmpty())) { // If validation fails
                res.status(400).json(validationRes.array()); // Return all error messages
            }
            const { email } = req.params;
            const { question_id, question_title, code} = req.body;
            const result = await addAttempt(email, question_id, question_title, code);
            res.status(200).json({message: `Attempt for question ${question_id} by ${email} created successfully`})
        } catch (error) {
            console.log(error);
            res.status(502).json({message: 'Internal Server Error'});
        }
    });

// Get all attempts by a user
router.get('/:email', param('email').notEmpty().isEmail().escape(), checkUserExists(), async (req, res) => {
    try {
        const validationRes = validationResult(req);
        if (!validationRes.isEmpty()) { // If validation fails
            res.status(400).json(validationRes.array()); // Return all error messages
        }
        const { email } = req.params;
        const result = await getAttemptsByUser(email);
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(502).json({message: 'Internal Server Error'});
    }
});

export default router;