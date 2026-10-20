import type { Request, Response, NextFunction } from "express";
import { addCategoryMethod } from "./Category.service";



export async function addCategory(req: Request, res: Response, next: NextFunction) {

    try {

        const category = req.body.category;
        console.log(category)
        
        
        if(category !== null){

            await addCategoryMethod(category)
        
            return res.status(200).json({
                message: "category added successfully"
            })

        }

    } catch (error) {

    }

}
