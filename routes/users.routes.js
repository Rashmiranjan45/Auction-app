import { Router } from "express";
import {getCurrentUser, loginUser, logoutUser, registerUser} from "../controller/users.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"
const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)

router.route("/logout").post(verifyJWT,logoutUser)
router.route("/profile").get(verifyJWT,getCurrentUser)


export default router