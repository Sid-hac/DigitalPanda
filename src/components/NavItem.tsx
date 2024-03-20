import { PRODUCT_CATAGORIES } from "@/config"
import { Button } from "./ui/button";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";




type catagory = typeof PRODUCT_CATAGORIES[number];

interface navItemProps {
    catagory: catagory,
    handleOpen: () => void,
    isOpen: boolean,
    isAnyOpen: boolean
}

const NavItem = ({ catagory, isAnyOpen, isOpen, handleOpen }: navItemProps) => {
    return (

        <div className="flex">
            <div className="flex items-center relative gap-2">
                <Button className="gap-1.5" variant={isOpen ? "secondary" : "ghost"} onClick = {handleOpen}>
                    {catagory.lable}
                <ChevronDown className={cn("h-4 w-4 transition-all text-muted-foreground" , {
                    "-rotate-180": isOpen,
                    
                })}/>
                </Button>
            </div>
            {isOpen && 
                <div className={cn("absolute inset-x-0 top-full text-sm text-muted-foreground" , {
                    "animate-in fade-in-10 slide-in-from-top-5":!isAnyOpen
                })}>
                    <div className="absolute inset-0 top-1/2 bg-white shadow " aria-hidden="true"/>
                   <div className="flex flex-row justify-center items-center gap-4 w-full  bg-white  mt-5 ">
                           {catagory.features.map((feature) => (
                              <div key={feature.name} className="relative group text-base sm:text-sm flex l flex-col col-span-1 items-start
                               justify-center gap-1 p-6">
                                  <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-300 hover:opacity-75 border border-gray-100 ">
                                     <Image src={feature.image} alt="feature product image"  className="object-contain" width={300} height={300}/>
                                  </div>
                                  <Link href={feature.href} className=" font-medium text-gray-900 mt-2">
                                      {feature.name}
                                  </Link>
                                  <p className="text-muted-foreground  mb-2">Shop Now</p>
                              </div>
                          ))}
                    

                   </div>
                </div>
            }
        </div>
    )
}

export default NavItem