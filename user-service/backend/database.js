import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

export async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

export async function validatePassword(plainText, hashedPassword) {
    return await bcrypt.compare(plainText, hashedPassword);
}

// Fetch the entire user without the password (For use when checking whether a user exists)
export async function getUserByEmail(email) {
    const { rows } = await pool.query("SELECT email FROM user WHERE email = $1", [email]);
    return rows[0];
}

// Fetch user hashed password for validation
export async function getUserPasswordByEmail(email) {
    const { rows } = await pool.query("SELECT password_hash FROM user WHERE email = $1", [email]);
    if (rows.length) {
        return rows[0].password_hash;
    }
    return null;
}

export async function insertUser(email, password) {
    const hashedPassword = await hashPassword(password);
    const result = await pool.query("INSERT INTO user (email, password_hash) VALUES ($1, $2) RETURNING *", [email, hashedPassword]);
    return result.rows[0];
}

export async function updateUser(email, password) {
    const hashedPassword = await hashPassword(password);
    const result = await pool.query("UPDATE user SET password_hash = $1 WHERE email = $2 RETURNING *", [hashedPassword, email]);
    return result.rows[0];
}

export async function deleteUser(email) {
    const result = await pool.query("DELETE FROM user WHERE email = $1 RETURNING *", [email]);
    return result.rows[0];
}