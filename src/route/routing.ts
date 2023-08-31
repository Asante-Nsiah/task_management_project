import express from 'express';
import { invite, loginRender, setPassword } from '../controller/authCtrl';
import { } from '../seeders/admin';
import { populateDb } from '../modules/populate-db';
import { authenticate } from 'passport';
import authenticateUser from '../controller/authUser';


const router = express.Router();

router.get('/login', loginRender)
router.get('/set-new-password', setPassword)
router.get('/admin', )
router.post('/Users', populateDb )
router.post('/login', authenticateUser)


export {router as Controller}