"use client"

import useCart from "@/hooks/use-cart"
import { cn, formatPrice } from "@/lib/utils"
import Image from "next/image"
import emptyCart from "../../../public/hippo-empty-cart.png"
import { PRODUCT_CATAGORIES } from "@/config"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {  CircleCheckBig, Loader2, X } from "lucide-react"
import { trpc } from "../../trpc/client"
import { useRouter } from "next/navigation"




const Page = () => {

    const router = useRouter();
    const { items, removeItem } = useCart()


    const {mutate : createCheckoutSession , isLoading} = trpc.payment.createSession.useMutation({
             // @ts-expect-error
        onSuccess : ({url}) => {
             
             if(url) {
            
                router.push(url)
             }
        }
    })

    
    const productIds = items.map(({product}) => product.id)
    const cartTotal = items.reduce((total, { product }) => total + product.price, 0)
    const fee = 1

    return (
        <div className="bg-white">
            <div className="mx-auto max-w-2xl px-4 pb-16 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">

                <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                    Shopping Cart
                </h1>

                <div className="mt-12 lg:grid lg:grid-cols-12  lg:items-start lg:gap-x-12 xl:gap-x-16 ">
                    <div className={cn("lg:col-span-7", {
                        "rounded-lg border-2 border-dashed border-zinc-200 p-12": items.length === 0
                    })}>
                        <h2 className="sr-only">
                            Items in your shopping cart                         </h2>

                        {items.length === 0 ? (
                            <div className="flex h-full flex-col items-center justify-center space-y-1">
                                <div aria-hidden='true' className="relative mb-4 h-40 w-40 text-muted-foreground">
                                    <Image src={emptyCart}
                                        alt="empty cart"
                                        fill
                                        loading="eager"
                                    />
                                </div>
                                <h3 className="font-semibold text-2xl">Your cart is empty</h3>
                                <p className="text-muted-foreground text-center">Whoops! Nothing to show here yet</p>

                            </div>
                        ) : null}

                        <ul className={cn({
                            'divide-y divide-gray-200 border-b border-t border-gray-200 ': items.length > 0

                        })} >
                            {items.map(({ product }) => {
                                const label = PRODUCT_CATAGORIES.find((c) => c.value === product.catagory)?.lable

                                const { image } = product.images[0]

                                return (
                                    <li key={product.id} className="flex py-6 sm:py-10 ">
                                        <div className="flex-shrink-0">
                                            <div className="relative h-24 w-24">
                                                {typeof image !== "string" && image.url ? (
                                                    <Image
                                                        src={image.url}
                                                        alt={product.name}
                                                        fill
                                                        loading="eager"
                                                        className="h-full w-full rounded-md object-cover object-center sm:h-48 sm:w-48"
                                                    />
                                                ) : null
                                                }

                                            </div>

                                        </div>
                                        <div className="ml-4 flex flex-col flex-1 justify-between sm:ml-6">
                                            <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                                                <div>
                                                    <div className="flex justify-between">
                                                        <h3 className="text-sm">
                                                            <Link href={`/product/${product.id}`}>
                                                                {product.name}
                                                            </Link>
                                                        </h3>

                                                    </div>

                                                    <div className="mt-1 flex text-sm">
                                                        <p className="text-muted-foreground">catagory : {label}</p>
                                                    </div>
                                                    <p className="mt-1 text-sm font-medium text-gray-900">{formatPrice(product.price)}</p>

                                                </div>


                                                <div className="mt-4 sm:mt-0 sm:pr-2 w-16">
                                                    <div className="absolute right-0 top-0">
                                                        <Button variant='ghost' aria-hidden='true' onClick={() => removeItem(product.id)}>
                                                            <X className="w-4 h-4" aria-hidden='true' />
                                                        </Button>

                                                    </div>

                                                </div>
                                            </div>
                                            <p className="mt-4 flex space-x-2 text-sm text-gray-700">
                                                <CircleCheckBig className="w-5 h-5 flex-shrink-0 text-green-700" />
                                                <span>Eligible for instant delivery</span>

                                            </p>

                                        </div>

                                    </li>
                                )
                            })}

                        </ul>

                    </div>
                    <section className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0  lg:p-8">
                        <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>

                        <div className="mt-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-600">SubTotal</p>
                                <p className="text-sm text-gray-900 font-medium">
                                    {formatPrice(cartTotal)}
                                </p>

                            </div>

                            <div className=" flex justify-between items-center border-t border-gray-200 pt-4">
                                <div className="text-sm items-center text-muted-foreground flex">
                                    <span>Flat Transaction fee</span>
                                </div>
                                <div className="text-sm font-medium text-gray-900">
                                    {formatPrice(fee)}

                                </div>
                            </div>
                            <div className=" flex justify-between items-center border-t border-gray-200 pt-4">
                                <div className="text-base font-medium items-center text-gray-900 flex">
                                    <span>Order Total</span>
                                </div>
                                <div className="text-sm font-medium text-gray-900">
                                    {formatPrice(cartTotal + fee)}

                                </div>
                            </div>


                        </div>

                        <div className="mt-6 ">
                           <Button onClick={() => createCheckoutSession({productIds})} 
                           disabled= { items.length === 0 || isLoading }
                           className="w-full" size='lg'>
                            {isLoading ? (<Loader2 className="w-4 h-4 animate-spin mr-1" />) : null}
                                Checkout

                           </Button>
                        </div>

                    </section>

                </div>

            </div>
        </div>
    )
}

export default Page