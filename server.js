const express = require("express");
var util = require("./utility");
const http = require("http");
const url = require("url");
const bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
const xboxliveservice = require("./xboxliveservice");

// Azure App Service will set process.env.port for you, but we use 3000 in development.
const PORT = process.env.PORT || 3000;

// Create the express routes
let app = express();
app.use(express.static("public"));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", async (req, res) => {
  let indexContent = await util.loadEnvironmentVariables({
    host: process.env["HTTP_HOST"],
  });
  res.end(indexContent);
});

app.post("/login", async (req, res) => {
  xboxliveservice
    .XBoxLiveAuthentication(req.body.username, req.body.password)
    .then((results) => res.send(results));
});

app.post("/profile", async (req, res) => {
  xboxliveservice
    .XBoxLiveAccountDetails(
      req.body.gamerTag,
      req.body.username,
      req.body.password
    )
    .then((results) => res.send(results));
});

// Create the HTTP server.
let server = http.createServer(app);
server.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
});
