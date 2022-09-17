
require("dotenv").config()
require('./config/database').connect()
const express = require('express')
const User = require('./model/user')



const app = express()

app.use(express.json())

app.get("/", (req, res) => {
    res.send("<h1>Hello From Groupy Coverage!</h1>")
})

app.post("/register", async (req, res) => {
    const { firstname, lastname, email, password } = req.body;
    if (!(email && password && firstname && lastname)) {
        res.send(400).send('All fields are required!')
    }
    const existingUser = await User.findOne({ email }) // Its a PROMISE

    if (existingUser) {
        res.send(401).send('User already exists!')
    }
})


module.exports = app