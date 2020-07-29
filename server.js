const express = require("express");
var util = require("./utility");
const http = require("http");
const url = require("url");
const bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
const xboxliveservice = require("./xboxliveservice");
const xboxRemoteService = require("./smartglass");
const Smartglass = require("xbox-smartglass-core-node");

const { Console } = require("console");

// Load the .env file if it exists
require("dotenv").config();

// Azure App Service will set process.env.port for you, but we use 3000 in development.
const PORT = process.env.PORT || 3001;

// Create the express routes
let app = express();
app.use(express.static("public"));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/", async (req, res) => {
  let indexContent = await util.loadEnvironmentVariables({
    host: process.env["HTTP_HOST"],
  });
  res.end(indexContent);
});

app.post("/login", async (req, res) => {
  xboxliveservice.XBoxLiveAuthentication(req, res).then((results) => {
    res.status(200).send(results);
  });
});

app.post("/profile", async (req, res) => {
  xboxliveservice.XBoxLiveAccountDetails(req, res).then((results) => {
    res.status(200).send(results);
  });
});

app.post("/presence", async (req, res) => {
  xboxliveservice
    .XBoxCustomGETAPI(
      "https://userpresence.xboxlive.com",
      "/users/me",
      req,
      res
    )
    .then((results) => {
      res.status(200).send(results);
    });
});

app.post("/achievements", async (req, res) => {
  xboxliveservice.getMyAchievements(req, res).then((results) => {
    res.status(200).send(results);
  });
});

app.post("/createchannel", async (req, res) => {});

app.post("/screenshots", async (req, res) => {
  xboxliveservice.getMyScreenshots(req, res).then((results) => {
    res.status(200).send(results);
  });
});

app.post("/gameclips", async (req, res) => {
  xboxliveservice.getMyGamerClips(req, res).then((results) => {
    res.status(200).send(results);
  });
});

app.post("/getfriends", async (req, res) => {
  xboxliveservice.getMyFriends(req, res).then((results) => {
    res.status(200).send(results);
  });
});

app.post("/gamertag", async (req, res) => {
  xboxliveservice.ChangeGamerTag(req, res).then((results) => {
    res.status(200).send(results);
  });
});

app.post("/checkconnection", async (req, res) => {
  xboxRemoteService.getAvailableConsoles().then((consoles) => {
    console.log(consoles);
  });
});

app.post("/connect", async (req, res) => {
  var ip;
  var dev;
  xboxRemoteService.getAvailableConsoles().then((consoles) => {
    console.log(consoles);
    if (consoles.length == 0) {
      res.end("NO");
    } else {
      for (var xbox in consoles) {
        ip = consoles[xbox].remote.address;
        dev = consoles[xbox].message.name;
        console.log("- Device found: " + consoles[xbox].message.name);
        console.log(
          "  Address: " +
            consoles[xbox].remote.address +
            ":" +
            consoles[xbox].remote.port
        );
      }
      xboxRemoteService.connect(consoles[xbox].remote.address);
      var result = {
        Device: dev,
        IP: ip,
      };
      console.log(result);
      res.end(JSON.stringify(result));
    }
  });
});

app.post("/turnoff", async (req, res) => {
  var ip = req.body.ip;
  console.log(ip);
  xboxRemoteService.poweroff(ip);
  res.sendStatus(200);
});

app.post("/buttonpress", async (req, res) => {
  var ip = req.body.ip;
  var button = req.body.button;
  console.log(ip);
  console.log(button);
  xboxRemoteService.buttonclick(ip, button);
  res.sendStatus(200);
});

// Create the HTTP server.
let server = http.createServer(app);
server.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
});
