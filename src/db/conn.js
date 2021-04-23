const mongoose = require('mongoose');
 mongoose.connect("mongodb://127.0.0.1:27017/sms-dev", {
     useNewUrlParser: true,
     useUnifiedTopology: true,
     useCreateIndex:true
 }).then(() =>{
     console.log(`conn success`);
 }).catch((e) =>{
     console.log('fail');
 })

 