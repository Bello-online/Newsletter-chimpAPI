const bodyParser = require("body-parser");
const express = require("express");
const axios = require("axios");
const https = require("https");
const dotenv = require("dotenv");
require("dotenv").config();


const app = express();     // An app instance used to initiate express

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("Allow"));

app.get("/",function(req,res){
    res.sendFile(__dirname + "/signup.html");
})

app.post("/", function(req,res){
   const FName = req.body.FName;
   const LName = req.body.LName;
   const email = req.body.email;

   var data = {        //data from Mailchimp API in JSON Format
    members: [  // Members from Mailchimp names 
        {
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: FName,
                LNAME: LName
            }
        }
    ]
   };
   const jsonData = JSON.stringify(data);   //Convering data to String

   const url = 'https://us21.api.mailchimp.com/3.0/lists/9e21f6e759'

   // Send back data to Mailchimp
   const options= {
    method: "POST",
    auth: process.env.API_KEY
   }
   const request= https.request(url,options,function(response){ //Gives a response from the MailChimp Server

    if(response.statusCode === 200){
        res.sendFile(__dirname + "/success.html");
    }else{
        res.send(__dirname + "/failure.html");
    }

    response.on("data",function(data){
        console.log(JSON.parse(data));
    })
   })
   request.write(jsonData);
   request.end();
});

app.post("/failure",function(req, res){
    res.redirect("/");                     //This redirects to the home route upon failure
})

app.listen(process.env.PORT || 3000,function(){  // The process.env.PORT is the port heroku runs your server on.
    console.log("Server is running on port 3000")
})




