
import { body } from 'express-validator';

const checkQuestionExists = () => body('question_id')
    .custom(async value => {
        // Call question service, verify whether question_id 'value' exists
    })
    .escape();

export {
    checkQuestionExists
}
