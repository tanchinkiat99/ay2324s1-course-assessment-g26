import mysql from "mysql2"

const pool = mysql.createPool({
    host: "127.0.0.1",
    user: "root",
    password: "user",
    database: "user"
}).promise()

export async function getUsername(){
    const [rows] = await pool.query("SELECT * FROM username") 
    return rows
}

export async function insertUser(username, password) {
    const result = await pool.query(
        "INSERT INTO username (username, password) VALUES (?, ?)", 
        [username, password])
}

// const username = await insertUser("test2", "test2")
// console.log(username)