import { useRouter } from "next/navigation"
import { toast } from "sonner"


export const useAuth =  () => {

    const router = useRouter();
    const signOut = async () => {

        try {
            const public_url = process.env.NEXT_PUBLIC_SERVER_URL
            if (!public_url) throw new Error("Couldn't find public url")
            const res = await fetch(`${public_url}/api/users/logout`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },

            })

            if (!res.ok) {
                throw new Error()
            }

            toast.success('signed out successfully')

            router.push('/sign-in')
            router.refresh()

        } catch (error) {

            toast.error("Couldn't sign out , Please try again")
        }

    }


    return { signOut }
}