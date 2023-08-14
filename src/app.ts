import dotenv from "dotenv";

const result = dotenv.config();

if(result.error) {
  // console.log(`Error loading envirnoment variable, aborting.`);
  process.exit(1);
} 

console.log(process.env.PORT);

import "reflect-metadata";
import express from 'express';
import { root } from './route/root';
import { isInteger } from './route/utils';
import { logger } from './route/logger';
import { AppDataSource } from "./route/data-source";
import path from 'path';
import { Controller } from './route/routing';
import { loginRender } from "./controller/authCtrl";



const app = express();

app.use(express.json()); // Used to parse JSON bodies
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..','dist', 'views'));
app.use(express.static(path.join(__dirname, '..', 'dist', 'public')));
app.use(express.static(path.join(__dirname, '..', 'dist')));
app.use(Controller);



const setupExpress = () => {
  
app.route("/").get(root);
app.route("/login").get(Controller);


}



const startServer = () => {
  
  let port: number = 8000;

  const portEnv: string | undefined = process.env.PORT,
        portArg = process.argv[2];

        if (portEnv !== undefined && isInteger(portEnv)) {
          port = parseInt(portEnv);
        }

  if (!port && isInteger(portArg)){
    port = parseInt(portArg);
  }

  if (!port) {
    port = 8000;
  }

  app.listen(port, () => {
    logger.info(`Server running on  port ${port}`);
});

}



AppDataSource.initialize()
    .then(()=>{
      logger.info(`The datasource has been initialized successfully.`);
      setupExpress();
      startServer();
    })
    .catch(err => {
      logger.error(`Error during datasource initialization.`, err);
      process.exit(1);
    })





