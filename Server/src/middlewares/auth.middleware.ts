
import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../Security/token";




export async function requireLogin(req:Request,res:Response,next:NextFunction){

    try {

      const authorization = req.get('authorization');
      const match = authorization?.match(/^Bearer\s+(\S+)$/i);

      console.log(match)
      if(!match){
        return res.status(401).json({
            message:"You have to login first"
        })
      }

      const payload = await verifyAccessToken(match[1]!)
      const userId = Number(payload.sub)
      if (!Number.isSafeInteger(userId)){

        return res.status(400).json({
            message:"Get back to login"
        })

      }
      res.locals.userId = userId;
      next()
    } catch (error) {

        throw new Error ("Error on require login middleware.")
        
    }



}