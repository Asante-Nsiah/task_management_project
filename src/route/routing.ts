import express from 'express';
import { loginRender, logout, setPassword} from '../controller/authCtrl';
import { } from '../seeders/admin';
import { populateDb } from '../modules/populate-db';
import { authenticate } from 'passport';
import authenticateUser from '../controller/newUserAuth';
import { checkIfAuthenticated } from '../controller/authCheck';
import { checkIfAdmin } from '../controller/authCheckAdmin';
import sendInvitation from '../controller/adminInviteUsers';
import newUser from '../controller/newUserAuth';
import { setActualPassword } from '../controller/setPassword';
import { userBoard } from '../controller/userBoard';
import { createProject } from '../controller/createProject';
import { collaborators } from '../controller/collaborators';

const router = express.Router();

router.get('/login', loginRender)
router.get('/set-new-password', setPassword)
router.post('/set-new-password', setActualPassword)
router.get('/admin', checkIfAuthenticated, checkIfAdmin, authenticateUser )
router.post('/Users', populateDb )
router.post('/login', authenticateUser)
router.post('/admin', sendInvitation)
router.post('/logout', logout)
router.get('/user-dashboard',checkIfAuthenticated, userBoard)
router.get('/user-dashboard/create-project',  createProject)
router.post('/user-dashboard/create-project/add',  collaborators)


export {router as Controller}