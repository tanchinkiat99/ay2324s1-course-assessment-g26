import pool from '../../database.js';

const addAttempt = async (email, question_id, question_title, code) => {
    const result = await pool.query("INSERT INTO attempt (email, question_id, question_title, code) VALUES ($1, $2, $3, $4)",
        [email, question_id, question_title, code]);

    return result.rows[0];
};

const getAttemptByUser = async (email) => {
    const result = await pool.query("SELECT * from attempt where email = $1", [email]);

    return result.rows;
}

export {
    addAttempt,
    getAttemptByUser
}
