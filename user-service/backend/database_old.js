import mysql from "mysql2"

const pool = mysql.createPool({
    host: "127.0.0.1",
    user: "root",
    password: "user",
    database: "user"
}).promise()

export async function getPassword(email){
    const password = await pool.query("SELECT password FROM username WHERE email = (?)", [email]) 
    return password
}

export async function insertUser(email, username, password) {
    const result = await pool.query("INSERT INTO username (email, username, password) VALUES (?, ?, ?)", [email, username, password])
}

export async function updateUser(email, username, password) {
    const result = await pool.query("UPDATE username SET username = (?), password = (?) WHERE email = (?)", [username, password, email])
}

export async function deleteUser(email) {
    const result = await pool.query("DELETE FROM username WHERE email = (?)", [email])
}

export async function getHistory(email){
    const result = await pool.query("SELECT question_id FROM history_bank WHERE email = (?)", [email])
    return result
}

export async function insertHistory(email, question_id){
    const result = await pool.query("INSERT INTO history_bank (email, question_id) VALUES (?, ?)", [email, question_id])
}

export async function deleteHistory(email){
    const result = await pool.query("DELETE FROM history_bank WHERE email = (?)", [email])
}

export default pool;