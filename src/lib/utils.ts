import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(
  price: number | string ,
  optins : {
       currency ?: "USD" | "EUR" | "GBP" | "INR",
       notation ?: Intl.NumberFormatOptions["notation"]
  } = {}
){
  const { currency = "USD", notation = "compact" } = optins
  
  const numericPrice = typeof price === "string" ? parseFloat(price) : price
  return new Intl.NumberFormat('en-us' , {
    style: 'currency',
    currency,
    notation,
    maximumFractionDigits: 2
  }).format(numericPrice) 
}

