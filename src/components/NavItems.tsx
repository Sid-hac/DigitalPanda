"use client"
import { useState } from "react"
import { PRODUCT_CATAGORIES  } from "../config/index";
import NavItem from "@/components/NavItem";


const NavItems = () => {

  
  const [activeIndex, setactiveIndex] = useState<null | number>(null);
  const isAnyOpen = activeIndex !== null;

   
  return (
    <div className="flex h-full gap-4">
       {
        PRODUCT_CATAGORIES.map((category , i) =>{
             const handleOpen = () => {
               if(activeIndex === i){
                 setactiveIndex(null);
               }else {
                 setactiveIndex(i);
               }
             }

             const isOpen = i === activeIndex
             return(
              <NavItem key={category.value} catagory={category} isOpen={isOpen} isAnyOpen={isAnyOpen} handleOpen={handleOpen}  />
             )
        }
        )
      }
       
    </div>
  )
}

export default NavItems