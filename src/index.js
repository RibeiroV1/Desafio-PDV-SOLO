require('dotenv').config()
const express = require("express")
const {rotas} = require('./rotas')


const app = express()

app.use(express.json())

app.use(rotas)


const porta = process.env.PORT || 3000
app.listen(porta)
