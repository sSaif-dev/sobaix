import { prisma } from '../../database/prisma'

export async function addCategoryService(categoryName: string) {

    await prisma.category.create({
        data: {
            Name: categoryName
        }
    })

}

export async function getAllCategoriesService() {

    return await prisma.category.findMany()

}



export async function updateCategoryService(categoryId: number, categoryName: string) {


    await prisma.category.update({
        where: {
            Id: categoryId
        }
        ,
        data: {
            Name: categoryName
        }

    })

}
