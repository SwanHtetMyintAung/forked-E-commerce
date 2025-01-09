import express from "express";
import {
    createUser,
    deleteUserById,
    getUserById,
    getUserProfile,
    loginUser,
    logoutUser,
    updateUserById,
    updateUserProfile
}
    from "../controllers/userController.js";

//middleware fucntion import
import { authenticate, authorizedAdmin } from '../middlewares/authMiddleware.js'

//init the express.js for routes
const router = express.Router();

//register route
router.post('/register', createUser)
//login route
router.post('/login', loginUser)
//logout route
router.post('/logout', logoutUser)

//authenticate  routes
router.route('/profile')
    .get(authenticate, getUserProfile)
    .put(authenticate, updateUserProfile)

//authenticate & authorized admin routes
router.route('/:id')
    .get(authenticate, authorizedAdmin, getUserById)
    .put(authenticate, authorizedAdmin, updateUserById)
    .delete(authenticate, authorizedAdmin, deleteUserById)



export default router;