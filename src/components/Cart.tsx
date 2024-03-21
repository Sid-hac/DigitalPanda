import { ShoppingCart } from "lucide-react"
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet"
import { Separator } from "./ui/separator";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import Image from "next/image";


const Cart = () => {

    const itemCount = 0;
    const fee = 1

    return (
        <Sheet>
            <SheetTrigger className="group flex items-center p-2">
                <ShoppingCart className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-600" aria-hidden='true' />
                <span className="ml-2 text-sm font-medium text-gray-400 group-hover:text-gray-600">0</span>
            </SheetTrigger>
            <SheetContent className="flex flex-col w-full ">
                <SheetHeader className="space-y-2 ">
                    <SheetTitle>Cart (0)</SheetTitle>
                </SheetHeader>
                {itemCount > 0 ? (
                    <>
                        <div className="flex flex-col gap-2 w-full items-center">
                            cart items
                        </div>
                        <div className="space-y-2">
                            <Separator />
                            <div className="flex flex-col gap-2">
                                <div className="flex">
                                    <span className=" flex-1">Shipping</span>
                                    <span>Free</span>
                                </div>
                                <div className="flex">
                                    <span className="flex-1">Transaction Fee</span>
                                    <span>{formatPrice(fee)}</span>
                                </div>
                                <div className="flex">
                                    <span className="flex-1">Total</span>
                                    <span>{formatPrice(fee)}</span>
                                </div>
                            </div>
                            <SheetFooter>
                                <SheetTrigger asChild>
                                    <Link href='/cart' className={buttonVariants({
                                        className: 'w-full'
                                    })}>
                                        Continue to Checkout 
                                    </Link>
                                </SheetTrigger>
                            </SheetFooter>
                        </div>
                    </>
                ) : (
                    <div className="h-full flex flex-col justify-center items-center space-y-2">
                        <div className="relative flex h-52 w-52 text-muted-foreground " aria-hidden='true'>
                           <Image src='/hippo-empty-cart.png' alt="empty cart image" fill/>
                        </div>
                        <div className="text-sm font-bold">
                            Your Cart is Empty
                        </div>
                        <SheetTrigger asChild>
                            <Link href='/products' className={buttonVariants({
                                variant:"link",
                                size:"sm",
                                className : 'text-sm text-muted-foreground'
                            })}>
                                Add Items To Your Cart To Checkout
                            </Link>
                        </SheetTrigger>

                    </div>
                )}
            </SheetContent>
        </Sheet>
    )
}

export default Cart