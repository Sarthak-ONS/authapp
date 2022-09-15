const express = require('express')
require("dotenv").config()

const app = express()

app.get("/", (req, res) => {
    res.send("<h1>Hello From Groupy Coverage!</h1>")
})


module.exports = app