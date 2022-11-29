import { NextFunction, Request, Response } from "express";
import { FarmService } from "./farms.service";
import { decode } from "jsonwebtoken";
import { UsersService } from "modules/users/users.service";
import { User } from "modules/users/entities/user.entity";

export class FarmController {
  private readonly farmService: FarmService;
  private readonly userService: UsersService;

  constructor () {
    this.farmService = new FarmService();
    this.userService = new UsersService();
  }

  public async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const authToken = req.headers.authorization?.split(" ")[1];

      if (!authToken) {
        res.status(401).send();
        return;
      }

      const {id} = decode(authToken) as { [id: string]: string };
      const user = await this.userService.findOneBy({ id });

      const allFarms = await this.farmService.getAllFarms(user as User);
      res.status(200).send(allFarms);
    } catch (error) {
      next(error);
    }
  }
}
