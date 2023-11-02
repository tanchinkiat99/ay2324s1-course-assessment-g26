import { body } from "express-validator";
import { getUserByEmail } from '../db/controllers/userController.js';

const checkUserExists = () => body('email')
    .notEmpty()
    .custom(async value => {
        const user = await getUserByEmail(value)
        if (!user) {
            throw new Error (`User ${value} not found`);
        }
    })
    .escape();

export {
    checkUserExists
};