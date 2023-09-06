import express from 'express';
import {  loginRender, logout, setPassword, userBoard } from '../controller/authCtrl';
import { } from '../seeders/admin';
import { populateDb } from '../modules/populate-db';
import { authenticate } from 'passport';
import authenticateUser from '../controller/newUserAuth';
import { checkIfAuthenticated } from '../controller/authCheck';
import { checkIfAdmin } from '../controller/authCheckAdmin';
import sendInvitation from '../controller/adminInviteUsers';
import newUser from '../controller/newUserAuth';
import { setActualPassword } from '../controller/setPassword';


const router = express.Router();

router.get('/login', loginRender)
router.get('/set-new-password', setPassword)
router.post('/set-new-password', setActualPassword)
router.get('/admin', checkIfAuthenticated, checkIfAdmin, authenticateUser )
router.post('/Users', populateDb )
router.post('/login', authenticateUser)
router.post('/admin', sendInvitation)
router.post('/logout', logout)
router.get('/user-dashboard', checkIfAuthenticated, userBoard)


export {router as Controller}