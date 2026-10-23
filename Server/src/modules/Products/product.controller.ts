import type { Request,Response,NextFunction } from "express";
import { AddProductSchema, UpdateProductSchema } from "./product.DTOs";
import { addProductService, productExists, updateProductService } from "./Product.service";

export async function addProduct (req:Request, res:Response, next:NextFunction ) {


    try {

        const result = await AddProductSchema.safeParse(req.body);

        if(!result.success){

            return res.status(400).json({

                message: `Invalid request data`

            })

        }

        const addItemResult = await addProductService(result.data, res.locals.userId)
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



export async function updateProduct (req:Request, res:Response, next:NextFunction ) {


    try {
        const ItemId = Number(req.params.id)

        if(!Number.isSafeInteger(ItemId) || ItemId < 1){
            return res.status(400).json({
                message:"Invalid request data"
            })
        }

        const result = await UpdateProductSchema.safeParse(req.body);

        if(!result.success){

            return res.status(400).json({

                message: `Invalid request data`

            })

        }

        const isValidProduct = await productExists(Number(ItemId));

        if(!isValidProduct){
            return res.status(404).json({
                message:"Item not found"
            })
        }

        

        
        const updateResults = await updateProductService(result.data,ItemId, res.locals.userId)
        if(updateResults !== null){
            
            return res.status(201).json({
                message: `Item updated successfully. ${updateResults.Id}`
            })
        }

        return res.status(400).json({
            message: "An error occured while updating the item"
        })




    } catch (error) {

        throw new Error(`Error occured on update product method \nError: ${error}`)
        
    }



}