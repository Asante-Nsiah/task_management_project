import express from 'express';
import {  loginRender, logout, setPassword } from '../controller/authCtrl';
import { } from '../seeders/admin';
import { populateDb } from '../modules/populate-db';
import { authenticate } from 'passport';
import authenticateUser from '../controller/authUser';
import { checkIfAuthenticated } from '../controller/authCheck';
import { checkIfAdmin } from '../controller/authCheckAdmin';
import { sendInvitation}  from '../controller/adminInviteUsers';

const router = express.Router();

router.get('/login', loginRender)
router.get('/set-new-password', setPassword)
router.get('/admin', checkIfAuthenticated, checkIfAdmin, authenticateUser )
router.post('/Users', populateDb )
router.post('/login', authenticateUser)
router.post('/admin', checkIfAuthenticated, checkIfAdmin, sendInvitation)
router.post('/logout', logout)

export {router as Controller}