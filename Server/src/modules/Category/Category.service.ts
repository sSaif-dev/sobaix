import {prisma} from '../../database/prisma'

export async function addCategoryMethod(categoryName: string) {

    await prisma.category.create({
        data:{
            Name: categoryName
        }
    })

}