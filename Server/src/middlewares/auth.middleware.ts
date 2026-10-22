
import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../Security/token";
import { isValidSessionIdService } from "../modules/Auth/Auth.service";




export async function requireLogin(req:Request,res:Response,next:NextFunction){

    try {

      const authorization = req.get('authorization');
      const match = authorization?.match(/^Bearer\s+(\S+)$/i);

      if(!match){
        return res.status(401).json({
            message:"You have to login first"
        })
      }

      const payload = await verifyAccessToken(match[1]!)
      const userId = Number(payload.sub)
      if (!Number.isSafeInteger(userId)){

        return res.status(401).json({
            message:"Get back to login"
        })

      }

      const isValidSession = await isValidSessionIdService(Number(payload["sid"]), Number(payload.sub))

      

      res.locals.userId = userId;
      next()
    } catch (error) {

      throw new Error ("Error on require login middleware.")
        
    }



}