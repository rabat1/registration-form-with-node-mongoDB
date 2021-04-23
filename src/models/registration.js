const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
 const commonDb = new mongoose.Schema({
    nameperson:{
        type:  String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    conpassword:{
        type: String,
        required: true,
    },
    tokens:[{
        token:{
            type:String,
            required:true,
        }
    }]

 })
  


 commonDb.methods.generateAuthToken = async function(){
try{
    const token = jwt.sign({_id:this._id.toString()},process.env.SECRET_KEY);
   this.tokens = this.tokens.concat({token:token});
   await this.save();
    return token;
}catch{
res.send("Ahhh token's error");
}
 }
commonDb.pre('save', async function(next){ // app.js pr reg se data gain ke baad pre ye call hoga 
    if(this.isModified('password')){   // sirf just tab hash karo jab pwd ke sath cher khani ho to
  this.password = await bcrypt.hash(this.password,10);
  this.conpassword= await bcrypt.hash(this.conpassword,10);
}
  next();   //is imp to return to app page 
  
})

 const Register = new mongoose.model('Register', commonDb );
 module.exports = Register;