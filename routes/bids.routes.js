import { Router } from "express";
import { createBid, retrieveBid } from "../controller/bids.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { checkAuctionEnd } from "../middlewares/auction.middleware.js";


const router = Router()


router
    .route("/create/:itemId")
    .post(verifyJWT,checkAuctionEnd,createBid)
router
    .route("/show/:itemId")
    .get(verifyJWT, retrieveBid);

export default router