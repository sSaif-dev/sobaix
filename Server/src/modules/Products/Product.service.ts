import { AddProductDTO } from "./product.DTOs";
import { prisma } from '../../database/prisma'

export async function addProductMethod(dto: AddProductDTO, userId: number) {


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

    const categoriesIds = [...new Set(dto.Categories)]

    const categories = await prisma.category.findMany({
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



    const Product = await prisma.item.create({
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
                connect: categoriesIds.map(id => ({
                    Id: id,
                })),
            },

        }
    });

    return Product;




}