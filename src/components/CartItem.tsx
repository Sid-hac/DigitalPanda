"use client"

import { PRODUCT_CATAGORIES } from "@/config"
import useCart from "../hooks/use-cart"
import { Product } from "@/payload-types"
import { ImageIcon, X } from "lucide-react"
import Image from "next/image"
import { formatPrice } from "@/lib/utils"



const CartItem = ({ product }: { product: Product }) => {

    const { image } = product.images[0]

    const {removeItem} = useCart();

    const label = PRODUCT_CATAGORIES.find(({ value }) => value === product.catagory)?.lable

    return (
        <div className="space-y-3 py-2 ">
            <div className="flex justify-between items-start gap-4 bg-slate-200 p-2 rounded-lg">
                <div className="flex w-full items-center space-x-4">
                    <div className="relative aspect-square h-16 w-16 min-w-fit overflow-hidden rounded">
                        {typeof image !== 'string' && image.url ? (
                            <Image src={image.url} alt={product.name} fill className="absolute object-contain" />
                        ) : (
                            <div className="flex h-full items-center justify-center bg-secondary">
                                <ImageIcon aria-hidden='true' className="h-4 w-4 text-muted-foreground" />
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col self-start">
                        <span className="line-clamp-1 text-sm font-medium mb-1">
                            {product.name}
                        </span>
                        <span className="line-clamp-1 text-xs capitalize text-muted-foreground">
                            {label}
                        </span>
                        <div className="mt-4 text-xs text-muted-foreground">
                            <button type="button" className="flex items-center gap-1" onClick={() => removeItem(product.id)}>
                                <X className="w-3 h-3" />
                                Remove
                            </button>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col space-y-1 font-medium">
                    <span className="ml-auto line-clamp-1 text-sm">
                        {formatPrice(product.price)}

                    </span>

                </div>
            </div>
        </div>
    )
}

export default CartItem