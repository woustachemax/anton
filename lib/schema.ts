import {z} from "zod";

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8)
})


export const signupSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8)
})

export type loginSchema = z.infer<typeof loginSchema>
export type signupSchema = z.infer<typeof signupSchema>
