"use client"

import { TQueryValidator } from "@/lib/validators/query-validator";
import { Product } from "@/payload-types";
import { trpc } from "@/trpc/client";
import Link from "next/link";
import ProductListings from "./ProductListings";


interface ProductReelProps {

    title: string
    subtitle?: string
    href?: string
    query : TQueryValidator
}

  const FALBACK_LIMIT = 4

const ProductReel = (props: ProductReelProps) => {

    const { title, subtitle, href , query  } = props;
    
    const { data :queryResults , isLoading } = trpc.getInfiniteProducts.useInfiniteQuery({
           limit : query.limit ?? FALBACK_LIMIT, query
    },{
         getNextPageParam : (lastpage) => lastpage.nextPage,
    })

    console.log(queryResults);
    

      const products = queryResults?.pages.flatMap(
        (page) => page.items
      )
    
      let map : (Product | null)[] = [];
      if(products && products.length){
         map = products
      }else if (isLoading){
           map = new Array<null>(query.limit ?? FALBACK_LIMIT).fill(null)
      }
    

    return (

        <section className="py-12 px-8">
            <div className="md:flex md:justify-between md:items-center mb-4">
                <div className="max-w-2xl  px-4 lg:max-w-4xl ">
                    {title ? (<h1 className="text-2xl font-bold text-gray-600 sm:text-3xl ">{title}</h1>) : null}
                    {subtitle ? (<p className="mt-2 text-sm text-muted-foreground  ">{subtitle}</p>) : null}
                </div>
                {
                    href ? (
                        <Link href={href} className=" hidden font-medium text-blue-600 hover:text-blue-500 mt-2 md:block">
                            Shop the collection <span aria-hidden='true'>&rarr;</span>
                        </Link>
                    ) : null
                }
            </div>
            <div className="relative">
               <div className="mt-6 w-full flex items-center ">
                  <div className="w-full grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 md:gap-y-10 lg:gap-x-8">
                      {map.map((product , i) =>  ( 
                         <ProductListings key={`product-${i}`} product={product} index={i} /> 
                      ))}
                  </div>
               </div>
            </div>
        </section>
    )
}

export default ProductReel