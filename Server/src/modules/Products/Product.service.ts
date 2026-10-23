import { AddProductDTO, UpdateProductDTO } from "./product.DTOs";
import { prisma } from '../../database/prisma'
import { Prisma } from "../../generated/prisma/client";

export async function addProductService(dto: AddProductDTO, userId: number) {


    const colours = dto.Colours.map(colour => ({

        Name: colour.Name,
        HexCode: colour.HexCode ?? "",
        Images: {
            create: colour.Images.map(image => ({

                Url: image.Url,
                SortIndex: image.SortIndex,
                AltText: image.AltText
            }))
        }
    }));

    const trans = await prisma.$transaction(async tx => {

        const categoriesIds = [...new Set(dto.Categories)]
        const categories = await tx.category.findMany({
            where: {
                Id: { in: categoriesIds }
            }
            ,
            select: {
                Id: true
            }
        })

        if (categoriesIds.length != categories.length) {
            throw new Error("Error on categories")
        }

        const Product = await tx.item.create({
            data: {
                Title: dto.Title,
                Description: dto.Description,
                Price: dto.Price,
                CreatedBy: userId,
                Colours: {
                    create: colours
                },
                Sizes: {
                    create: dto.Sizes.map(size => ({
                        Name: size
                    }))
                },
                Categories: {
                    connect: categories,
                }
            },
            select: {
                Id: true,
                Colours: true,
                Sizes: true
            }
        });


        const ColoursIds = Product.Colours.map(colour => ({
            Id: colour.Id
        }))

        const SizesIds = Product.Sizes.map(size => ({
            Id: size.Id
        }))

        if (ColoursIds.length * SizesIds.length < dto.Variants.length) {
            throw new Error("Invalid input data")

        }

        const Variants = dto.Variants.map(variant => {

            const colour = Product.Colours.find(color => color.Name === variant.ItemColourName)
            const size = Product.Sizes.find(size => size.Name === variant.ItemSizeName)

            if (!colour || !size) {
                throw new Error("Invalid input data")

            }

            return {
                ItemId: Product.Id,
                ItemColourId: colour.Id,
                ItemSizeId: size.Id,
                Quantity: variant.Quantity
            }
        })



        await tx.itemVariant.createMany({
            data: Variants
        })


        return {
            Product: Product
        }


    })

    return trans.Product
}







export async function updateProductService(dto: UpdateProductDTO, itemId: number, userId: number) {

    if (dto.Colours !== undefined || dto.Sizes !== undefined || dto.Variants !== undefined) {
        throw new Error(
            "Updating colours, sizes and variants is not supported yet"
        );
    }

    if (dto.Categories === undefined && dto.Description === undefined && dto.Title === undefined && dto.Price === undefined) {
        throw new Error(
            "Provide at least one field to update"
        );
    }

    return prisma.$transaction(async tx => {

        const user = await tx.user.findUnique({
            where: {
                Id: userId
            },
            select: {
                Id: true,
                Role: true
            }
        })

        if (!user) {
            
            throw new Error("Invalid user-id");
        }

        if (user.Role !== "SuperAdmin" && user.Role !== "Admin") {
            throw new Error("Authorization error");
        }

        const product = await tx.item.findUnique({
            where:{
                Id: itemId
            },
            select:{
                Id:true
            }
        })

        if(!product){
            throw new Error("Invalid productId");
        }
        
        const categoriesIds = dto.Categories !== undefined ? [...new Set(dto.Categories)] : undefined
        const data: Prisma.ItemUpdateInput = {}
        if(dto.Title !== undefined) data.Title = dto.Title
        if(dto.Description !== undefined) data.Description = dto.Description
        if(dto.Price !== undefined) data.Price = dto.Price

        if(categoriesIds !== undefined){

            const categories = await tx.category.findMany({
                where:{
                    Id: {in: categoriesIds}
                }
                
            })
            
            if(categories.length !== categoriesIds.length){

                throw new Error("Invalid request data");

            }

            data.Categories = {
                set: categories
            }
            
        }

        return tx.item.update({
                where:{
                    Id: product.Id
                },
                data:data
                ,
                select:{
                    Id:true
                }
        })



    })

    


}





export async function productExists(ItemId: number): Promise<boolean> {

    const result = await prisma.item.findUnique({
        where: {
            Id: ItemId
        }
    })

    if (result) {

        return true
    }
    return false

}