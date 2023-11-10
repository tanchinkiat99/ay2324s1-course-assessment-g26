import pool from '../../database.js';

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
    try {
        const { rows } = await pool.query("SELECT * FROM clientuser WHERE email = $1", [email]);
        if (rows.length === 0) {
            return null;
        }
        return rows[0];
    } catch (error) {
        console.error(`Error fetching user by email: ${error.message || error}`);
        throw new Error("Internal server error");
    }

}

async function insertUser(email, name, image, user_role) {
    const { rows } = await pool.query("INSERT INTO clientuser (email, name, image, user_role) VALUES ($1, $2, $3, $4)", [email, name, image, user_role])
    return rows[0];
}

async function updateUserName(email, newName) {
    const result = await pool.query('UPDATE clientuser SET name = $1 WHERE email = $2', [newName, email]);
    return result.rowCount > 0;
}

async function deleteUser(email) {
    const result = await pool.query("DELETE FROM clientuser WHERE email = $1", [email]);
    return result.rowCount > 0;
}

export {
    getUserByEmail,
    getUserCompleteByEmail,
    insertUser,
    updateUserName,
    deleteUser
}
