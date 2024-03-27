
"use client"

import { icons } from '@/components/Icons'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import Link from 'next/link';

import { z, ZodError } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { authCredentialValidator, TauthCredentialValidator } from '@/lib/validators/acc-cred'
import { trpc } from '@/trpc/client'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

const Page = () => {

    const router = useRouter();

    const { register, handleSubmit, formState: { errors } } = useForm<TauthCredentialValidator>({
        resolver: zodResolver(authCredentialValidator),
    })

    const { mutate, isLoading } = trpc.auth.createPayloadUser.useMutation({

        onError: (err) => {
            if (err.data?.code === 'CONFLICT') {
                toast.error("This Email already in use. Sign in instead?")
                return
            }

            if (err instanceof ZodError) {
                toast.error(err.issues[0].message)
                return
            }

            toast.error("something went wrong. Please try again")
        },
        onSuccess: () => {
            toast.success("Account created successfully")
            router.push('/login')
        }
    })

    const onsubmit = ({ email, password }: TauthCredentialValidator) => {
        //   send data to server
        mutate({
            email,
            password
        })
    }
    if (isLoading) {
        return (
            <div className='flex flex-col items-center gap-2'>
                <Loader2 className='animate-spin h-12 w-12 text-zinc-400' />
                <p className='text-md text-muted-foreground'>This won&apos;t take too long</p>
            </div>
        )
    }

    return (
        <>
            <div className="container flex flex-col justify-center items-center p-10">
                <div className="w-full flex flex-col justify-center items-center sm:w-[350px] space-y-6 ">
                    <div className="flex flex-col text-center justify-center items-center">
                        <icons.logo className="h-12 w-12" />
                        <h1 className="text-2xl font-bold">Sign-in to your account</h1>
                        <p className='text-sm '>
                            don&apos;t have an acoount?
                            <span className='text-sm font-semibold text-muted-foreground '>
                                <Link href="/sign-up" className={buttonVariants({
                                    variant: 'link',
                                })}>
                                    Sign-up

                                </Link>
                            </span>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onsubmit)} className='w-full flex flex-col flex-1'>
                        <div className='flex flex-col flex-1 gap-6 w-full'>
                            <div className='flex flex-col gap-2'>
                                <Label htmlFor='email'>Email</Label>
                                <Input
                                    {...register("email")}
                                    className={cn({
                                        "focus-visible:ring-red-500": errors.email
                                    })}
                                    placeholder='you@example.com'
                                />
                                {errors?.email && <p className='text-red-500 text-xs'>{errors.email.message}</p>}
                            </div>
                            <div className='flex flex-col gap-2'>
                                <Label htmlFor='password'>password</Label>
                                <Input
                                    {...register("password")}
                                    type='password'
                                    className={cn({
                                        "focus-visible:ring-red-500": errors.password
                                    })}
                                    placeholder='password'
                                />
                                {errors?.password && <p className='text-red-500 text-xs'>{errors.password.message}</p>}
                            </div>
                            <Button>Sign in</Button>
                        </div>
                    </form>
                </div>

            </div>
           
        </>
    )
}

export default Page