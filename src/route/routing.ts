import express from 'express';
import { loginRender, logout, setPassword} from '../controller/authCtrl';
import { } from '../seeders/admin';
import { populateDb } from '../modules/populate-db';
import { authenticate } from 'passport';
import authenticateUser from '../controller/newUserAuth';
import {  isAuthenticated } from '../controller/authCheck';
import { checkIfAdmin } from '../controller/authCheckAdmin';
import sendInvitation from '../controller/adminInviteUsers';
import newUser from '../controller/newUserAuth';
import { setActualPassword } from '../controller/setPassword';
import { userBoard } from '../controller/userBoard';
import { createProject, createProjectGet} from '../controller/createProject';
import { collaborators } from '../controller/collaborators';
import { projectBoard } from '../controller/projectBoard';
import authenticateNewUser from '../controller/newUserAuth';
import { addAssignee, createTask, createTaskDisplay } from '../controller/createTask';

const router = express.Router();

router.get('/login', loginRender)
router.get('/set-new-password', setPassword)
router.post('/set-new-password', setActualPassword)
router.get('/admin',  checkIfAdmin, authenticateUser )
router.post('/Users', populateDb )

router.post('/admin', sendInvitation)
router.post('/logout', logout)
// router.use('/user-dashboard', checkIfAuthenticated)
router.post('/login', authenticateUser)
router.get('/user-dashboard',isAuthenticated, userBoard)
router.get('/create-project',isAuthenticated, createProjectGet)
router.post('/create-project/new',  createProject)
router.post('/create-project/add', collaborators)
router.get('/project-board',isAuthenticated, projectBoard)
router.get('/create-task', isAuthenticated, createTaskDisplay)
router.post('/create-task',createTask)
router.post('/create-task/add-assignee', addAssignee)

export {router as Controller}