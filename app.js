var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var passport = require("passport");
var localStrategy = require("passport-local");
var User = require("./models/user.js");
var Job = require("./models/job.js");
var Phone = require("./models/phone.js");
var say = require('say');
var festival = require("festival");

app.set("view engine","ejs");

mongoose.connect("mongodb://localhost/findmyneed");
app.use(bodyParser.urlencoded({extended:true}));

//Passport Configuration
app.use(require("express-session")({
    secret:"Shashank is best!",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    next();
}); 

//home route
app.get("/",function(req,res){
    res.render("home");
});

//index route
app.get("/findmyneed",function(req,res){
    res.render("index");
});

app.get("/findmyneed/owner",isLoggedIn,function(req,res){
    res.render("owner/owner");
});

app.get("/findmyneed/employee",isLoggedIn,function(req,res){
    res.render("employee/employee");
});

app.get("/findmyneed/owner/new",isLoggedIn,function(req,res){
    res.render("owner/new");;
});

//create a new job
app.post("/findmyneed/owner",isLoggedIn,function(req,res){
    Job.create(req.body.job,function(err,createdjob){
        if(err){console.log(err);}
        else{
            res.redirect("/findmyneed/owner");
        }
    });
});

//to show on employee page
app.get("/findmyneed/employee/show",isLoggedIn,function(req,res){
    Job.find({},function(err,jobs){
        if(err){console.log(err);}
        else{
            res.render("employee/show",{jobs:jobs});
        }
    });
});

//to show employee profile
app.get("/findmyneed/profile",function(req,res){
    res.render("profile");
});

//add phone number
app.get("/findmyneed/employee/show/:id",isLoggedIn,function(req,res){
    Job.findById(req.params.id,function(err,job){
        if(err){console.log(err);}
        else{
            res.render("employee/new",{job:job});
        }
    })
    
});

//to show on employee request
app.get("/findmyneed/owner/employeereq",function(req,res){
    Phone.find({},function(err,phone){
        if(err){console.log(err);}
        else{
            Job.find({},function(err,jobs){
                if(err){console.log(err);}
                else{
                    res.render("owner/req",{phone:phone,jobs:jobs});
                }
            });
            
        }
    });

});

app.post("/findmyneed/employee/:id",function(req,res){
    Phone.create(req.body.phonenumber,function(err,phone){
        if(err){console.log(err);}
        else{
            res.redirect("/findmyneed/employee/show");
        }
        
    });
});

app.get("/findmyneed/ab",function(req,res){
    //it will convert text inti speech
    say.speak("Aadha padha kisne padha jisme taakat sabse jyada", 'Shashank');
});
//==========================$$
//AUTH ROUTES
//==========================$$

//show register form
app.get("/register",function(req,res){
    res.render("register");
});

//handle signup logic
app.post("/register",function(req,res){
    var newUser = new User({username:req.body.username});
    User.register(newUser,req.body.password,function(err,user){
        if(err)
        {
            console.log(err);
            return res.redirect("/register");
        }
        else{
            passport.authenticate("local")(req,res,function(){
                res.redirect("/findmyneed");
            });
        }
    });
});

//show login form
app.get("/login",function(req,res){
    res.render("login");
});

//handle login logic
app.post("/login",passport.authenticate("local",{
    successRedirect:"/findmyneed",
    failureRedirect:"/login"
}),function(req,res){
});

//logout route
app.get("/logout",function(req,res){
    req.logout();
    res.redirect("/findmyneed");
});

//middleware
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


//server startup code
app.listen("3000",function(){
    console.log("Server has Started");
});


