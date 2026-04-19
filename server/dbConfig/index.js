const mongoose = require('mongoose');


const dbconfig=()=>{
    return mongoose.connect(process.env.DB_URL)
  .then(() => console.log('Connected!'));   
}
module.exports=dbconfig  