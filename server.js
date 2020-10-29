const path = require("path");
const express = require("express");
const app = require("./public/App.js");

const server = express();

server.use(express.static(path.join(__dirname, "public")));
server.use(express.static(path.join(__dirname, "lang")));

server.get("*", function(req, res) {
  const { html } = app.render({ url: req.url });
  
  res.type('html')
  res.write(`
<!DOCTYPE html>
<link rel='stylesheet' href='/bundle.css'>
<link rel="icon" href="/favicon.png">
<div id="app">${html}</div>
<script src="/bundle.js"></script>
  `);

  res.end();
});

const port = 3000;
server.listen(port, () => console.log(`Listening on port ${port}`));