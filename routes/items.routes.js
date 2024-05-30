import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  createItem,
  deleteItem,
  getAllItems,
  getSingleItem,
  updateItem,
} from "../controller/items.controller.js";

const router = Router();

router.route("/create").post(verifyJWT, upload.single("imageUrl"), createItem);

  router.route("/all").get(getAllItems);

router
  .route("/view/:id")
  .get(verifyJWT, getSingleItem);

router
  .route("/update/:id")
  .post(verifyJWT, upload.single("imageUrl"), updateItem);
router
  .route("/delete/:id")
  .get(verifyJWT, deleteItem);

export default router;
