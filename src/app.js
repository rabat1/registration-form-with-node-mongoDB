require('dotenv').config();  //should be at first
const express = require('express');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');   //to get cookie where we store token ofter login register
const auth= require('./middleware/auth');
require('./db/conn');
const hbs = require('hbs');
const path = require('path');
const app= express();
const Register = require('./models/registration');
const {json} = require('express');
const port= process.env.PORT || 3000;

const static_path = path.join(__dirname, '../public');
const templates_path = path.join(__dirname, '../templates/views');
const partial_path = path.join(__dirname, '../templates/partials');
app.use(express.json());
app.use(cookieParser()); //here mention to tell we will use it as a middleware to get cookie val
app.use(express.urlencoded({extended: false}));
app.use(express.static(static_path));
app.set('view engine', 'hbs');

// to set vdefault open page
app.set('views', templates_path); // to set vdefault open page
hbs.registerPartials(partial_path)
app.get('/', (req, res) =>{
    res.render("index");   //open first as default 
})


app.get('/secret',auth, (req, res) =>{ //auth is middleware pehle isko check karayga agar permission yes to scret page par janaydega
    res.render("secret"); 
   // console.log(`awesome vookie ${req.cookies.jwt}`); //so is cookie ki help se only that use can accsee secret page who have login cookie token

})

app.get('/logout',auth,async (req, res) =>{ //auth is middleware pehle isko check karayga agar permission yes to scret page par janaydega
  try {
      console.log(req.user);
      //for single device logout
      req.user.tokens= req.user.tokens.filter((currelem)=>{
          return currelem.token !== req.token//(abhi wala) //rem only desktop browser token mob wala nahi
      })
      //for all devices logout
      req.user.tokens=[];
      res.clearCookie("jwt");
     console.log("chal naa bhaag"); 
     await req.user.save();
     res.render('login');
  } catch (error) {
      res.status(500).send(error)
  }
})


app.get('/registration', (req, res) =>{
    res.render("registration");   //open first as default 
})

app.get('/login', (req, res) =>{
    res.render("login"); 
})


app.post('/registration', async(req, res)=>{
try{
    const password= req.body.password;
    const cpassword= req.body.conpassword;
    if(password==cpassword){
        const registerEmp = new Register({
            nameperson: req.body.nameperson,
            password:req.body.password,
            conpassword:req.body.conpassword,
            email: req.body.email
        })
        //middleware
        const token = await registerEmp.generateAuthToken();
        //after next() from registration this will run
        res.cookie("jwt", token,{   //to store token in browser cookies in client computer ye isliye store karwa rahay hain ke kuch pages jo sirf login ko show hona chahiyye wo is cookie ke ststus se dekhlngy k if login so have token in his cookie so allow to access that pg
            expires: new Date(Date.now()+400000),
            httpOnly:true  //se client is cookie ko delete kuch nhi kar sakta
        });  //accept 2 arg 1st name 2nd vale 3rd optional
        const reg= await registerEmp.save();
        res.status(201).render("index");
    }
     

}catch(error){
res.status(400).send(error);
}
});

app.get('/login', (req, res) =>{
    res.render("login");   //open first as default 
})
app.post('/login', async (req, res) =>{
    try{
const email= req.body.email;
const password = req.body.password;
const useremail= await Register.findOne({email});
const isMatch = await bcrypt.compare(password,useremail.password);
console.log(isMatch);
        
if(isMatch){
    const token = await useremail.generateAuthToken();
    res.cookie("jwt", token,{
        expires: new Date(Date.now()+400000),
        httpOnly:true  //se client is cookie ko delete kuch nhi kar sakta
        //secure: true   onle when https protocol use so save cookie
    });  //accept 2 arg 1st name 2nd vale 3rd optional
    
    res.status(201).render('index');
}else{
    res.status(400).send("Invaid data");
}
    }catch{
        res.status(400).send("Invaid data");
    }
})


app.listen(port, ()=>{
    console.log(`server is running ${port}`);
})


//#git init then git status then type nul > .gitignore for create gitignore file then goto file and type node_modules and .env and all you want ti hide then git add . then git commit -m "rabatbackend
//then goto githup and create repo and copy that type command git remote add origin https://github.com/rabat1/registration-form-with-node-mongoDB.git
//https://www.youtube.com/watch?v=zoqW6qSjSfI&list=PLwGdqUZWnOp1P9xSsJg7g3AY0CUjs-WOa&index=40 link for git