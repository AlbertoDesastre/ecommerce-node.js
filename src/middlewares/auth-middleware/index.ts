import { Request, Response, NextFunction } from "express";

import { AuthService } from "../../components/auth/services";
import { ErrorThrower } from "./types";

class AuthMiddleware {
  private authService = new AuthService();
  constructor() {
    this.checkToken = this.checkToken.bind(this);
  }

  async checkToken(req: Request, res: Response, next: NextFunction) {
    try {
      this.validaTokenFormat(req, res, next);
      let token = this.transformToReadableToken(
        req.headers.authorization as string
      );
      let decodedToken: any = this.authService.verifyToken(token);
      let error: any;

      if (!decodedToken) {
        error = new Error(ErrorThrower.INVALID_TOKEN);
        error.statusCode = 400;
      }

      if (decodedToken.id !== req.params.id) {
        throw new Error(ErrorThrower.NOT_ALLOWED);
      }

      next();
    } catch (err) {
      next(err);
    }
  }

  validaTokenFormat(req: Request, res: Response, next: NextFunction) {
    let token: string | undefined = req.headers.authorization;
    let error: any;

    if (!token) {
      error = new Error(ErrorThrower.TOKEN_NOT_FOUND);
      error.statusCode = 400;
      next(error);
    } else if (!token.startsWith("Bearer ")) {
      error = new Error(ErrorThrower.TOKEN_WRONG_FORMAT);
      error.statusCode = 400;
      next(error);
    }
  }

  transformToReadableToken(rawToken: string) {
    return rawToken.replace("Bearer ", "");
  }
}

export { AuthMiddleware };
