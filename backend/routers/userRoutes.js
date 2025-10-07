import express from 'express';
import userContoller from '../controllers/userController.js';
import {roleBasedAccess, verifyUserAuth } from "../middleware/userAuth.js";
const router = express.Router();

router.route('/register').post(userContoller.registerUser);
router.route('/login').post(userContoller.loginUser);
router.route('/logout').post(userContoller.logout);
router.route('/password/forgot').post(userContoller.resetPassword);
router.route('/reset/:token').post(userContoller.resetPasswordHandler);
router.route('/profile').get(verifyUserAuth,userContoller.getUserDetails)
router.route('/password/update').put(verifyUserAuth,userContoller.updatePassword);
router.route('/profile/update').put(verifyUserAuth,userContoller.updateProfile);
router.route('/admin/users').get(verifyUserAuth,roleBasedAccess('admin'),userContoller.getUserList);
router.route('/admin/users/:id').get(verifyUserAuth,roleBasedAccess('admin'),userContoller.getSingleUser)
    .put(verifyUserAuth,roleBasedAccess('admin'),userContoller.updateUserRole)
    .delete(verifyUserAuth,roleBasedAccess('admin'),userContoller.deleteUser);

export default router; 