require('dotenv').config();
var express = require('express');
var port = process.env.PORT || 8000;
var app = express();
app.get('/', function (req, res) {
    res.send('Hello, World! THIS IS MY SECOND PROJECT');
});
app.listen(port, function () {
    console.log("Server running on port ".concat(port));
});
