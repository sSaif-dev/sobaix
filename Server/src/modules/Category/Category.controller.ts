import type { Request, Response, NextFunction } from "express";
import { addCategoryService, getAllCategoriesService, updateCategoryService } from "./Category.service";



export async function addCategory(req: Request, res: Response, next: NextFunction) {

    try {

        const category = req.body.Name ?? "";

        if (category == null || category === "") {
            return res.status(400).json({
                message: "Invalid request data"
            })
        }   


        if(category.length <= 2 || category.length > 30){

            return res.status(400).json({
                message: "Invalid request data"
            })
            
        }

        await addCategoryService(category)

        return res.status(200).json({
            message: "category added successfully"
        })


    } catch (error) {

    }

}


export async function getAllCategories(req: Request, res: Response, next: NextFunction) {

    try {

        const categories = await getAllCategoriesService();
        return res.status(200).json({
            categories: categories
        })


    }

    catch (error) {
        next(error)

    }

}




export async function updateCategory(req: Request, res: Response, next: NextFunction) {

    try {
        const categoryId = req.query.categoryId ?? -1
        console.log(categoryId)
        const categoryName = req.body.Name ?? ""
        console.log(categoryName)

        if (categoryId == null || categoryName === "") {
            return res.status(400).json({
                message: "Invalid request data"
            })
        }

        if(categoryName.length < 2 || categoryName.length > 30){

            return res.status(400).json({
                message: "Invalid request data"
            })
            
        }

        await updateCategoryService(Number(categoryId), categoryName)

        return res.status(204).json()
    }

    catch (error) {
        next(error)

    }

}

