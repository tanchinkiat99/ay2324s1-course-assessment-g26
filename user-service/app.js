import express from "express"
import {getPassword, insertUser, updateUser, deleteUser, getHistory, insertHistory, deleteHistory} from './database.js'

const app = express()

app.use(express.json())

//Used to get password during login
app.post("/users/login", async (req,res) => {
    var email = req.body.email
    var password = await getPassword(email)
    res.status(201).send(password)
})

//Update User profile
app.post("/users/update", async (req,res) => {
    var email = req.body.email
    var username = req.body.username
    var password = req.body.password
    await updateUser(email, username,password)
    res.status(201).send()
})

//Create profile
app.post("/users/create", async (req,res) => {
    var email = req.body.email
    var username = req.body.username
    var password = req.body.password
    await insertUser(email, username,password)
    res.status(201).send()
})

//Delete Profile
app.post("/users/delete", async (req,res) =>{
    var email = req.body.email
    await deleteUser(email)
    await deleteHistory(email)
    res.status(201).send()
})

//Get a user question history
app.get("/questions/:email", async (req,res) => {
    var email = req.body.email
    var result = await getHistory(email)
    res.status(201).send(result)
})

//Insert new question history
app.post("/users/questions", async(req,res) => {
    var email = req.body.email
    var question_id = req.body.question_id
    await insertHistory(email, question_id)
    res.status(201).send()
})

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send("Something Broke")
})

//Initial Connection
app.listen(8080, () => {
    console.log("Server is running on port 8080")
})