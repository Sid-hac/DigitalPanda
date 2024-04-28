import { User } from "../payload-types";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { NextRequest } from "next/server";


export const getServerSideUser = async (
    cookies: NextRequest['cookies'] | ReadonlyRequestCookies
) => {

     const token = cookies.get('payload-token')?.value

     const public_url = process.env.NEXT_PUBLIC_SERVER_URL

     if (!public_url) throw new Error("Couldn't find public url at me")
 
     const meRes = await fetch(`${public_url}/api/users/me`, {
            headers: {
                Authorization: `JWT ${token}`,
            }
        })
        
        
        
        const { user } = (await meRes.json()) as { user: User | null }
        
        
        return  user 

}