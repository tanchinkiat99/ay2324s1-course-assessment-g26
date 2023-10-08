import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

import pkg from 'pg';

dotenv.config();

const { Pool } = pkg;
const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

pool.connect((err, client, release) => {
    if (err) {
        console.error('Error connecting to PostgreSQL:', err);
    } else {
        console.log('Connected to PostgreSQL');
    }
    release();
});

export async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

export async function validatePassword(plainText, hashedPassword) {
    return await bcrypt.compare(plainText, hashedPassword);
}

// Fetch the user's email (For use when checking whether a user exists)
export async function getUserByEmail(email) {
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
export async function getUserCompleteByEmail(email) {
    const { rows } = await pool.query("SELECT * FROM clientuser WHERE email = $1", [email]);
    return rows[0];
}

// Fetch password hashed for verification
export async function getUserPasswordByEmail(email) {
    const { rows } = await pool.query("SELECT password_hash FROM clientuser WHERE email = $1", [email]);
    if (rows.length) {
        return rows[0].password_hash;
    }
    return null;
}

export async function insertUser(email, name, password, google_id, auth_method) {
    let result;
    switch (auth_method) {
        case "local":
            const hashedPassword = await hashPassword(password);
            result = await pool.query("INSERT INTO clientuser (email, name, password_hash, auth_method) VALUES ($1, $2, $3, 'local')", [email, name, hashedPassword]);
            break;
        case "google":
            result = await pool.query("INSERT INTO clientuser (email, name, google_id, auth_method) VALUES ($1, $2, $3, 'google')", [email, name, google_id])
            break;

    }
    return result.rows[0];
}

export async function updateUser(email, password) {
    const hashedPassword = await hashPassword(password);
    const result = await pool.query("UPDATE clientuser SET password_hash = $1 WHERE email = $2", [hashedPassword, email]);
    return result.rows[0];
}

export async function deleteUser(email) {
    const result = await pool.query("DELETE FROM clientuser WHERE email = $1", [email]);
    return result.rows[0];
}