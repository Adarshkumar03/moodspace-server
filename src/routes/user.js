import { Router } from "express";
import userController from "../controllers/userControllers";

const router = Router();

router.post("/register", userController.register_user);
router.post("/login", userController.login_user)


export default router;
