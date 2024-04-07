import { z } from "zod";
import { privateProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";
import { getPayloadClient } from "../get-payload";
import { stripe } from "../lib/stripe";
import type Stripe from "stripe";


export const paymentRouter = router({

    createSession: privateProcedure.input(z.object({
        productIds: z.array(z.string())
    })).mutation(async ({ ctx, input }) => {

        const { user } = ctx
        const { productIds } = input

        if (productIds.length === 0) {
            return new TRPCError({ code: "BAD_REQUEST" })
        }

        const payload = await getPayloadClient();

        const { docs: products } = await payload.find({
            collection: 'products',
            where: {
                id: {
                    in: productIds
                }
            }
        })


        const filteredProducts = products.filter((prod) => Boolean(prod.priceId))

        const filteredProductsIds = filteredProducts.map((prod) => prod.id)

        const order = await payload.create({
            collection: "orders",
            data: {
                _isPaid: false,
                products: filteredProductsIds,
                user: user.id

            }
        })

        const line_items : Stripe.Checkout.SessionCreateParams.LineItem[] = [];

        filteredProducts.forEach((prod) => {
            line_items.push({
                price : prod.priceId!,
                quantity : 1
            })
        })

        line_items.push({
            price : "price_1P2sngSJWSx0REoeYTeHHbCl",
            quantity : 1 , 
            adjustable_quantity : {
                enabled : false
            }
        })

        try {

            const stripeSession = await stripe.checkout.sessions.create({

                success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you?orderId=${order.id}`,

                cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/cart`,

                payment_method_types: ["card"],
                mode: "payment",
                metadata: {
                    userId: user.id,
                    orderId: order.id
                },
                line_items,
            })

            return {
                url : stripeSession.url
            }

        } catch (error) {
            console.log(error);
            return {
                url : null
            }
            

        }
    })
})