const express = require('express')
const app = express()
const cors = require('cors')
const cookieParser = require('cookie-parser')

const dbconfig = require('./dbConfig')
const  route  = require('./router')


app.use(express.json())
app.use(cookieParser())
require("dotenv").config()
app.use(cors())
dbconfig()
app.use(route)

 
  
app.listen(8000, () => {
  console.log("server is running")
})
//  node2501ecomers    