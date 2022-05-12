import { Router } from "express";
import controller from "../controllers/dashboard";
import middlewares from "../middlewares";

const router = Router();

router.get('/', middlewares.discordAuth, controller.index);

export default router;