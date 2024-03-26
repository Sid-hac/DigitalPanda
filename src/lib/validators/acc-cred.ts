import { z } from "zod"


export const authCredentialValidator = z.object({
    email: z.string().email(),
    password: z.string().min(8, { message: "Password must be 8 characters long." }).max(20)
})
export type TauthCredentialValidator = z.infer<typeof authCredentialValidator>