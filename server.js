// Mail Jet API Key (Public key)
// 4beabcbddc51388e585de8bd65eb35e3
//Mail Jet Secret Key
// 28413150048a11e643e7084e9214e6ec


const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.listen(process.env.PORT || 3000, function (req, res) {
    console.log("Server running on port 3000");
});

// common url for sub and unsub
const url = "https://api.mailjet.com/v3/REST/contactslist/53278/managemanycontacts";

//common "options" object for requests
const options = {
    method: "POST",
    auth: "4beabcbddc51388e585de8bd65eb35e3:28413150048a11e643e7084e9214e6ec"
}

//---------------------------------------------------------------------------------------

// GET and POST for Subscribing to newsletter

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/subscribe.html");
});

app.post("/", function (req, res) {

    const email = String(req.body.email);
    fullName = (req.body.firstName) + " " + (req.body.lastName);
    const data = JSON.stringify({
        Action: "addnoforce",
        Contacts: [
            {
                "Email": email,
                "Name": String(fullName)
            }
        ]
    });

    const request = https.request(url, options, function (response) {
        if (response.statusCode === 200 || response.statusCode === 201) {
            res.sendFile(__dirname + "/success.html");
        }
        else {
            console.log(response.statusCode);
            res.sendFile(__dirname + "/failure.html");
        }
    });

    request.write(data);   //sending data to the API
    request.end();
});

//---------------------------------------------------------------------------------------------------

// GET and POST for Unsubscribing to newsletter

app.get("/unsubscribe", function (req, res) {
    res.sendFile(__dirname + "/unsubscribe.html");
});

app.post("/unsubscribe", function (req, res) {

    const email = String(req.body.email);

    const data = JSON.stringify({
        Action: "remove",
        Contacts: [
            {
                "Email": email
            }
        ]
    });

    const request = https.request(url, options, function (response) {
        if (response.statusCode === 200 || response.statusCode === 201) {
            res.sendFile(__dirname + "/success-unsub.html");
        }
        else {
            console.log(response.statusCode);
            res.sendFile(__dirname + "/failure-unsub.html");
        }
    });

    request.write(data);   //sending data to the API
    request.end();
});


//To redirect to subscribing page
app.get("/subscribe.html", function (req, res) {
    res.redirect("/");
});


//To redirect to the unsubscribing page
app.get("/unsubscribe.html", function (req, res) {
    res.redirect("/unsubscribe");
});

