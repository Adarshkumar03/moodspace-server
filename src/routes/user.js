import { Router } from "express";
import userController from "../controllers/userControllers";

const router = Router();
// router.get("/", userController.get_users_list);
router.post("/register", userController.register_user);
router.post("/login", userController.login_user);
router.get("/list", userController.get_users_list);

export default router;
