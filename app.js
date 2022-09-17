
require("dotenv").config()
require('./config/database').connect()

const express = require('express')
const User = require('./model/user')
const app = express()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')



app.use(express.json())

app.get("/", (req, res) => {
    res.send("<h1>Hello From Groupy Coverage!</h1>")
})

app.post("/register", async (req, res) => {

    try {

        const { firstname, lastname, email, password } = req.body;

        // Checking all fields are null or not
        if (!(email && password && firstname && lastname)) {
            res.status(400).json('All fields are required!')
        }

        const existingUser = await User.findOne({ email }); // return a PROMISE

        if (existingUser) {
            res.status(401).json({ error: "User already exists" })
        }



        const myEncrPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            firstname,
            lastname,
            email: email.toLowerCase(),
            password: myEncrPassword
        })


        // token creation

        const token = jwt.sign({ user_id: user._id, email },
            process.env.SECRET_KEY,
            {
                expiresIn: "2h"
            }
        )
        await User.updateOne({
            "_id": user._id
        }, {
            token
        })
        user.token = token

        user.password = undefined
        res.status(201).json(user)
    } catch (error) {
        console.log("Error has occured");
        console.log(error);
    }

})

app.post("/login", async (req, res) => {
    try {

        const { email, password } = req.body;
        if (!(email && password)) {
            res.status(400).send("Field is missing!")
        }
        const user = await User.findOne({
            email
        })

        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign({
                user_id: user._id, email
            },
                process.env.SECRET_KEY,
                {
                    expiresIn: "2h"
                }
            )

            user.token = token
            user.password = undefined
            res.status(200).json(user)

        }

        res.status(400).send({ "error": "Email or password is incorrect" })



    } catch (error) {
        console.log("Eror occured while logging in!");
        console.log(error);
    }
})

module.exports = app