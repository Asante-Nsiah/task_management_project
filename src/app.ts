require('dotenv').config();


const express = require('express');
const port = process.env.PORT || 8000;
const app = express();

app.get('/', (req, res) => {
    res.send('Hello, World! THIS IS MY TYPESCRIPT/NODE PROJECT');
  });

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});