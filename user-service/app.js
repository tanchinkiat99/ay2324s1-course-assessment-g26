import express from "express"
import {getUsername, insertUser} from './database.js'

const app = express()

app.get("/users/:username", async (req, res) => {
    const notes = await getUsername()
    res.send(notes)
})

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send("Something Broke")
})

app.listen(8080, () => {
    console.log("Server is running on port 8080")
})