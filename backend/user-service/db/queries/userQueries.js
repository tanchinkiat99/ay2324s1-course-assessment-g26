import bcrypt from "bcrypt";
import pool from '../../database.js';

async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

async function validatePassword(plainText, hashedPassword) {
    return await bcrypt.compare(plainText, hashedPassword);
}

// Fetch the user's email (For use when checking whether a user exists)
async function getUserByEmail(email) {
    try {
        const { rows } = await pool.query("SELECT email FROM clientuser WHERE email = $1", [email]);
        if (rows.length === 0) {
            return null;
        }
        return rows[0];
    } catch (error) {
        console.error(`Error fetching user by email: ${error.message || error}`);
        throw new Error("Internal server error");
    }
}

// Fetch the entire user
async function getUserCompleteByEmail(email) {
    const { rows } = await pool.query("SELECT * FROM clientuser WHERE email = $1", [email]);
    return rows[0];
}

async function insertUser(email, name, image, user_role) {
    let result;

    result = await pool.query("INSERT INTO clientuser (email, name, image, user_role) VALUES ($1, $2, $3, $4)", [email, name, image, user_role])

    return result.rows[0];
}

async function updateUserName(email, newName) {
    const result = await pool.query('UPDATE clientuser SET name = $1 WHERE email = $2', [newName, email]);
    return result.rowCount > 0;
}

async function deleteUser(email) {
    const result = await pool.query("DELETE FROM clientuser WHERE email = $1", [email]);
    return result.rows[0];
}

export {
    getUserByEmail,
    getUserCompleteByEmail,
    insertUser,
    updateUserName,
    deleteUser
}