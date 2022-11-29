import { RequestHandler, Router } from "express";
import { FarmController } from "modules/farms/farms.controller";

const router = Router();
const farmController = new FarmController();

router.get("/", farmController.getAll.bind(farmController) as RequestHandler);

export default router;
