require('dotenv').config();  //should be at first
const express = require('express');
const bcrypt = require('bcryptjs');

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
app.use(express.urlencoded({extended: false}));
app.use(express.static(static_path));
app.set('view engine', 'hbs');

// to set vdefault open page
app.set('views', templates_path); // to set vdefault open page
hbs.registerPartials(partial_path)
app.get('/', (req, res) =>{
    res.render("index");   //open first as default 
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


//#git init then git status then type nul > .gitignore for create gitignore file then goto file and type node_modules and .env and all you want ti hide