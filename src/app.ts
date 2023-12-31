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
import session from 'express-session';
import bodyParser from 'body-parser';
import passport from 'passport';
import initialize   from "./config/passportConfig";
import { Strategy as LocalStrategy } from 'passport-local';
import { checkTokenValidity } from "./controller/authCtrl";
import http from 'http';
import { Server } from 'socket.io';
import cookieParser from "cookie-parser";
import expressSession from 'express-session';

const app = express();





app.use(session({ 
secret: process.env.SESSION_SECRET || 'defaultSecret', 
resave: false, 
saveUninitialized: true,
cookie: {
  secure: false, // Set to true in production with HTTPS
},
}));


app.use(passport.initialize());
app.use(passport.session());

initialize(passport);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..','dist', 'views'));
app.use(express.static(path.join(__dirname, '..', 'dist', 'public')));
app.use(express.static(path.join(__dirname, '..', 'dist')));
app.use(express.static(path.join(__dirname, 'dist', 'modules')));
app.use(Controller);
app.use(checkTokenValidity);
// Initialize cookie-parser middleware
app.use(cookieParser());

const setupExpress = () => {
  
app.route("/").get(root);
app.route("/login").get(Controller);
app.route("/login").post(Controller);
// app.route("/loginAccount").get(Controller);
app.route("/set-new-password").get(Controller);
app.route("/Users").get(Controller);
app.route("/admin").get(Controller);
app.route("/logout").post(Controller);
app.route("/user-dashboard").get(Controller);
app.route("/create-project").get(Controller);
app.route("/create-project/new").post(Controller);
app.route("/create-project/add").post(Controller);
// app.route("/user-dashboard").get(Controller);
app.route("/project-board").get(Controller);
app.route("/create-task").get(Controller);
app.route("/create-task").post(Controller);
app.route("/create-task/add-assignee").post(Controller);

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



