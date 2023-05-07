import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

// Token Verification Service Middleware
export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  jwt.verify(
    token.toString().split(" ")[1],
    process.env.JWT_SECRET as string,
    (err: any, decoded: any) => {

      if (err) {
        return res.status(401).send({ message: "Unauthorized!", error: err });
      }
    if(req.body.u__id !== decoded.id){
      return res.status(401).send({ message: "Provide a valid access token." });
    }
      next();
    }
  );
};
