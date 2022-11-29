import { RequestHandler, Router } from "express";
import { FarmController } from "modules/farms/farms.controller";
import auth from "middlewares/auth.middleware";

const router = Router();
const farmController = new FarmController();

router.get("/", auth, farmController.getAll.bind(farmController) as RequestHandler);

export default router;
