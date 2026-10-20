import z from "zod"


export const LoginSchema = z.object({

    email: z.string().trim().min(5).max(50).pipe(z.email()),
    password: z.string().min(6).max(100)

})

export const SignUpSchema = z.object({

    username: z.string().trim().min(5).max(50),
    password: z.string().min(6).max(100)
    


})


export type LoginDTO = z.infer<typeof LoginSchema>
export type SignUpDTO = z.infer<typeof SignUpSchema>