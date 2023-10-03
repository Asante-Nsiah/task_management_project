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
import { createProject, displayCreateProject } from '../controller/createProject';
import { collaborators } from '../controller/collaborators';
import { projectBoard } from '../controller/projectBoard';
import authenticateNewUser from '../controller/newUserAuth';

const router = express.Router();

router.get('/login', loginRender)
router.get('/set-new-password', setPassword)
router.post('/set-new-password', setActualPassword)
router.get('/admin', checkIfAuthenticated, checkIfAdmin, authenticateUser )
router.post('/Users', populateDb )
router.post('/login', authenticateUser)
router.post('/admin', sendInvitation)
router.post('/logout', logout)
// router.use('/user-dashboard', checkIfAuthenticated);
router.get('/user-dashboard', userBoard)
// router.get('/user-dashboard', userBoard)
router.get('/create-project', checkIfAuthenticated, displayCreateProject)
router.post('/create-project/new',  createProject)

router.post('/create-project/add', collaborators)
// router.get('/user-dashboard', collaborators)

router.get('/project-board', projectBoard)

export {router as Controller}