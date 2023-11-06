import { param } from "express-validator";
import { getUserByEmail } from '../db/controllers/userController.js';

const checkUserExists = () => param('email')
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