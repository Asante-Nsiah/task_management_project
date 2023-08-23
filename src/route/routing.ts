import express from 'express';
import { invite, loginAccount, loginRender, setPassword } from '../controller/authCtrl';
import { } from '../seeders/admin';
import { populateDb } from '../modules/populate-db';


const router = express.Router();

router.get('/login', loginRender)
router.get('/set-new-password', setPassword)
router.get('/admin-invite', )
router.post('/loginAccount', loginAccount)
router.post('/Users', populateDb )
router.get('/admin-board', loginAccount)

export {router as Controller}