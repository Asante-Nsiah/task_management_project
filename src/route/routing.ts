import express from 'express';
import { loginRender } from '../controller/authCtrl';


const router = express.Router();

router.get('/login', loginRender)


export {router as Controller}