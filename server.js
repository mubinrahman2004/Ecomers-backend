const express = require('express')
const app = express()
const cors = require('cors')
const cookieParser = require('cookie-parser')

const dbconfig = require('./dbConfig')
const  route  = require('./router')
const cloudinaryConfig = require('./services/cloudinaryConfig')
const { webhook } = require('./controllers/orderControllers')

app.use(express.urlencoded({extended:true}))
app.use(express.json())

app.use(cookieParser())
require("dotenv").config()
app.use(cors())
dbconfig()
cloudinaryConfig()
app.use(route)

 app.post('/webhook', express.raw({type: 'application/json'}), webhook);

  
app.listen(8000, () => {
  console.log("server is running")
})
//  node2501ecomers    