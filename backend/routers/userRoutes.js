import express from 'express';
import userContoller from '../controllers/userController.js';
const router = express.Router();

router.route('/register').post(userContoller.registerUser);
router.route('/login').post(userContoller.loginUser);
router.route('/logout').post(userContoller.logout);

export default router;