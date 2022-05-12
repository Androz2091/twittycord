import { Router } from "express";
import controller from "../controllers/api";
import middlewares from "../middlewares"; // may need in future

const router = Router();

router.get('/getAllUsers', controller.getAllUsers);
router.get('/getUser', controller.getUser);

export default router;