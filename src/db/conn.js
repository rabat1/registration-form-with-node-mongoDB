const mongoose = require('mongoose');
 mongoose.connect(process.env.CONN, {
     useNewUrlParser: true,
     useUnifiedTopology: true,
     useCreateIndex:true
 }).then(() =>{
     console.log(`conn success`);
 }).catch((e) =>{
     console.log('fail');
 })

 