// require('dotenv').config();
import express from 'express';
import { root } from './route/root';

const port = process.env.PORT || 8000;
const app = express();


const setupExpress = () => {
  
app.route("/").get(root);

}

const startServer = () => {

  app.listen(port, () => {
    console.log(`Server running on  port ${port}`);
});

}

setupExpress();
startServer();
// app.get('/', (req, res) => {
//     res.send('Hello, World! THIS IS MY TYPESCRIPT/NODE PROJECT');
//   });


