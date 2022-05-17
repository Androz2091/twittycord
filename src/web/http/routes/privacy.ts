import { Router } from "express";
import controller from "../controllers/privacy";

const router = Router();

router.get('/', controller.index);

export default router;
