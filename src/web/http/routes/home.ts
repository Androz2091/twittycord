import { Router } from "express";
import controller from "../controllers/home";

const router = Router();

router.get('/', controller.index);

export default router;