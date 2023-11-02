
const validateAttemptRequest = (req, res, next) => {
    const { email, question_id, question_title, code } = req.body;

    if (!email || !question_id || !question_title || !code) {
        return res.status(400).json({ error: 'Missing required fields for an attempt.' });
    }

    next();
};

const checkQuestionExists = async (req, res, next) => {
    // Call question service, verify whether question exists
    next();
}

export {
    validateAttemptRequest,
    checkQuestionExists
}