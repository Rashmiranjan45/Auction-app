import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getNotification, markNotificationAsRead } from "../controller/notification.controller.js";

const router = Router();

router.route("/view").get(verifyJWT,getNotification)
router.route("/mark-read").post(verifyJWT,markNotificationAsRead);

export default router;
