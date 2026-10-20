import type { Request,Response,NextFunction } from "express";
import { AddProductSchema } from "./product.DTOs";
import { addProductMethod } from "./Product.service";

export async function addProduct (req:Request, res:Response, next:NextFunction ) {


    try {

        const result = await AddProductSchema.safeParse(req.body);

        if(!result.success){

            return res.status(400).json({

                message: `Error: ${result.error.message}`

            })

        }

        const addItemResult = await addProductMethod(result.data, res.locals.userId)
        if(addItemResult !== null){
            
            return res.status(201).json({
                message: `Item created successfully. \nItemId: ${addItemResult.Id}`
            })
        }

        return res.status(400).json({
            message: "An error occured while creating the item"
        })




    } catch (error) {

        throw new Error(`Error occured on add product method \nError: ${error}`)
        
    }



}