import { authCredentialValidator } from "../lib/validators/acc-cred";
import { publicProcedure, router } from "./trpc";
import { getPayloadClient } from "../get-payload";
import { TRPCError } from "@trpc/server";



export const authRouter = router({

    createPayloadUser : publicProcedure.input(authCredentialValidator).mutation(async ({input}) => {

        const { email , password } = input
        const payload = await getPayloadClient()

        // check if user is already there
        const {docs : users} = await payload.find({
            collection : "users",
            where : {
                email :{
                    equals : email
                }
            }
        })
       if(users.length !== 0) {
          throw new TRPCError({code : 'CONFLICT'})
       }

       await payload.create({
           collection : 'users',
           data : {
               email : email,
               password : password,
               role : 'user'
           }
       })

       return{success: true }
    }),
    signIn : publicProcedure.input(authCredentialValidator).mutation(async ({input , ctx}) => {

        const {email , password} = input
        const {res} = ctx
        const payload = await getPayloadClient()

        try {
            await payload.login({
                collection : "users",
                data : {
                    email: email,
                    password : password
                },
                res,
            })
            
          return {success: true}
        } catch (error) {
             throw new TRPCError({code : 'UNAUTHORIZED'})
        }
    })
})