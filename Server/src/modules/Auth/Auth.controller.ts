import type { Request, Response, NextFunction } from "express";
import { LoginService, refreshTokenService, SignUpService } from "./Auth.service";
import { LoginSchema, SignUpSchema } from "./Auth.DTOs";



export async function Login(req: Request, res: Response, next: NextFunction) {

    try {

        const result = LoginSchema.safeParse(req.body);
        console.log(result.success)
        if (!result.success) {

            return res.status(400).json({
                message: "Invalid request parameters",
                error: result.error.message
            })
        }

        const sessionDetails = {
            IpAddress: req.ip ?? "",
            UserAgent: req.get("user-agent") ?? ""
        }

        const loginResult = await LoginService(result.data,sessionDetails);

        if (loginResult === null) {

            return res.status(401).json({
                message: "Invalid email or password"
            })
        }

        res.locals.userId = loginResult.userId;
        res.cookie("rt",loginResult.RefreshToken,{
            httpOnly: true,
            path: '/auth',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        return res.status(200).json({
            message: "Login successfully",
            Token: loginResult!.AccessToken
        })

    } catch (error) {
        next(error)

    }

}

export async function SignUp(req: Request, res: Response, next: NextFunction) {

    try {
        const result = SignUpSchema.safeParse(req.body)
        if (!result.success) {
            return res.status(400).json({
                message: "Invalid request parameters",
                error: result.error.message
            })
        }

        const user = await SignUpService(result.data);


        if(user == null){
            return res.status(400).json({
                message:"Invalid data"
            })
        }

        
        return res.status(201).json({
            message:`User created successfully ${user.data}`
        })



    } catch (error) {
        next(error)

    }

}


export async function refreshAccessToken(req:Request,res:Response,next:NextFunction){

    try {
        
        const refreshToken = req.cookies?.rt 
        
        if(typeof(refreshToken) !== "string" || refreshToken.length === 0){

            return res.status(401).json({
                message:"Please login again."
            })
            
        }

       const result =  await refreshTokenService(refreshToken);

       if(result === null){

            return res.status(401).json({
                message:"Please login again."
            })

       }

       res.cookie("rt",result.RefreshToken,{
            httpOnly: true,
            path: '/auth',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })


        return res.status(200).json({
            AccessToken: result.AccessToken
        })

    } catch (error) {
        next(error)
    }


}