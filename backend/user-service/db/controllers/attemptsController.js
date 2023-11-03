import pool from '../../database.js';

const addAttempt = async (email, question_id, question_title, code) => {
    const { rows } = await pool.query("INSERT INTO attempts (email, question_id, question_title, code) VALUES ($1, $2, $3, $4)",
        [email, question_id, question_title, code]);

    return rows[0];
};

const getAttemptsByUser = async (email) => {
    const { rows } = await pool.query("SELECT * from attempts where email = $1", [email]);

    return rows;
}

export {
    addAttempt,
    getAttemptsByUser
}
