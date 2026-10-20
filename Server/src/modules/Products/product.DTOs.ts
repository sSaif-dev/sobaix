import z from "zod";




const ProductColoursImageDTO = z.object({

    Url: z.string().min(4).max(200),
    SortIndex: z.int32().nonnegative(),
    AltText: z.string().min(2).max(40)
    

})



const ProductColourDTO = z.object({
    
    Name: z.string().min(2).max(30),
    HexCode: z.string().trim().min(6).max(7).optional(),
    Images: z.array(ProductColoursImageDTO).default([])


})

export const AddProductSchema = z.object({

    Title: z.string().min(4).max(50),
    Description:z.string().min(10).max(100),
    Price: z.number().positive(),
    Sizes: z.array(z.string().trim().min(1).max(5)).min(1).max(10),
    Colours: z.array(ProductColourDTO).min(1),
    Categories: z.array(z.number()).min(1).max(5),





})


export type AddProductDTO = z.infer<typeof AddProductSchema>;
