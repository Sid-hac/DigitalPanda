"use client"


import { useEffect, useState } from "react"
import { Button } from "./ui/button"
import useCart from "@/hooks/use-cart"
import { Product } from "@/payload-types"


const AddToCartButton = ({product} : {product : Product}) => {

    const {addItem} = useCart()

 const [IsSuccess , setIsSuccess] = useState<boolean>(false)
  
 useEffect(() => {
     const timeout = setTimeout(() => {
         setIsSuccess(false)
     } , 2000)

     return () => clearTimeout(timeout)
 } , [IsSuccess])

  return (
     <Button onClick={() => {
        addItem(product)
        setIsSuccess(true)
        
        }} size='lg' className="w-full">
        {IsSuccess ? 'Added !' : 'Add To Cart'}
     </Button>
  )
}

export default AddToCartButton