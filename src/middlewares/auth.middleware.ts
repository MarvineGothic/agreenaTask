import config from "config/config";
import { UserError } from "errors/errors";
import { NextFunction, Request, Response } from "express"
import { verify } from "jsonwebtoken"
import { User } from "modules/users/entities/user.entity";
import { UsersService } from "modules/users/users.service";

declare module "express" {
  interface Request {
    user: User;
  }
}

async function auth(req: Request, res: Response, next: NextFunction) {
  try {
    const userService = new UsersService();
    const authToken = req.headers.authorization?.replace("Bearer", "").trim();

    if (!authToken) {
      res.status(401).send();
      return;
    }

    const { id } = verify(authToken, config.JWT_SECRET) as { [id: string]: string };

    const user = await userService.findOneBy({ id });

    if (!user) {
      throw new UserError("User doesn't exist")
    }

    req.user = user;
    next()
  } catch (error) {
    console.log(error)
    res.status(401).send()
  }
}

export default auth;
