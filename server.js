//from https://github.com/heroku/node-js-getting-started

const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 5000;

express()
    .use(express.static(__dirname + "/dist"))   //the bundle should be here
    .get("*", (req, res) => res.sendFile(path.resolve(__dirname, "index.html")))
    .listen(PORT, () => console.log(`Listening on ${PORT}`));
