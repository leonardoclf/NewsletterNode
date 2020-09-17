// Setup

const auth = require("./secret");
const express = require("express");
const bodyParse = require("body-parser");
const https = require("https");




const app = express();


// Caminho de arquivo statico - informa o lugar desses arq. caminhos relativos
app.use(express.static("public"));

// BodyParser 
app.use(
    bodyParse.urlencoded({extended: true})
);

// Setup

// Routes 

// home - route 
app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const mail = req.body.mail;
    // console.log(`${firstName} + ${lastName} + ${mail}`);

    let data = {
        members: [
            {
                email_address: mail,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    

    const url = `https://${auth.loc}.api.mailchimp.com/3.0/lists/${auth.appId}`;

    const option = {
        method: "POST",
        auth: `leonardoclf:${auth.apiKey}`
    };

    const request = https.request(url, option, function(response){
        
        // como pegar o status
        response.statusCode === 200 ? res.sendFile(__dirname + "/success.html") 
        : res.sendFile(__dirname + "/failure.html");
        
        
        
        response.on("data", function(data){
            console.log(JSON.parse(data));
        });
    });

    request.write(jsonData);
    request.end();


});
// home - route 

// failure - route
app.post("/failure", function(req, res){
    res.redirect("/");
});
// failure - route


// Route




//  Ligando o server 
app.listen(process.env.PORT || 3000, function(){
    console.log("Servidor funcionando na 3000");
})


