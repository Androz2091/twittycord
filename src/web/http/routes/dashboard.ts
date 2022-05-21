import { Router } from "express";
import controller from "../controllers/dashboard";
import middlewares from "../middlewares";

const router = Router();

router.get('/', middlewares.discordAuth, controller.index);
router.post('/delete', middlewares.discordAuth, controller.delete);

export default router;