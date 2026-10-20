import type { Request, Response, NextFunction } from "express";
import { LoginMethod, SignUpMethod } from "./Auth.service";
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

        const loginResult = await LoginMethod(result.data);

        if (loginResult === null) {

            return res.status(401).json({
                message: "Invalid email or password"
            })
        }

        res.locals.userId = loginResult.userId;
        
        return res.status(200).json({
            message: "Login successfully",
            Token: loginResult!.token
        })

    } catch (error) {

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

        const user = await SignUpMethod(result.data);


        if(user == null){
            return res.status(400).json({
                message:"Invalid data"
            })
        }

        
        return res.status(201).json({
            message:`User created successfully ${user.data}`
        })



    } catch (error) {

    }

}