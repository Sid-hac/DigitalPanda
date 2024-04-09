"use client"



import { DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { DropdownMenu, DropdownMenuContent } from "./ui/dropdown-menu"
import { Button } from "./ui/button"
import { User } from "../payload-types"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"


const UserAccNav = ({ user }: { user: User | null }) => {

    const {signOut} = useAuth();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild className="overflow-visible">
                <Button variant='ghost' className="relative" size="sm">
                    My account
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white w-60 " align="end">
                <div className="flex flex-col items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-2 ">
                        <p className="font-medium text-black text-sm">{user?.email}</p>
                    </div>
                </div>
                <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="cursor-pointer">
                      <Link href='/sell'>
                          Seller dashboard
                      </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" 
                  onClick={signOut}
                  >
                      Logout
                  </DropdownMenuItem>
            </DropdownMenuContent>



        </DropdownMenu>
    )
}

export default UserAccNav