
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
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'

const Page = () => {

    const searchParams = useSearchParams();
    const isSeller = searchParams.get('as') === 'seller'
    const origin = searchParams.get('origin')

    const router = useRouter();

    const continueAsSeller = () => {
        router.push('?as=seller')
    }
    const continueAsBuyer = () => {
        router.replace('/sign-in', undefined);
    }

    const { register, handleSubmit, formState: { errors } } = useForm<TauthCredentialValidator>({
        resolver: zodResolver(authCredentialValidator),
    })

    const { mutate : signIn, isLoading } = trpc.auth.signIn.useMutation({

        onSuccess: () => {
            toast.success('Signed in successfully')
            router.refresh()

            if (origin) {
                router.push(`/${origin}`)
                return
            }

            if (isSeller) {
                router.push('/sell')
                return
            }

            router.push('/')
        },

        onError: (err) => {
            if(err.data?.code === 'UNAUTHORIZED'){
                toast.error('Invalid email or password')
            }
        }
    })

    const onsubmit = ({ email, password }: TauthCredentialValidator) => {
        //   send data to server
        signIn({
            email: email,
            password: password
        })
    }
    if (isLoading) {
        return (
            <div className='flex flex-col items-center justify-center gap-2'>
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
                        <h1 className="text-2xl font-bold">Sign-in to your {isSeller ? "seller" : ""} {" "} account</h1>
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

                    <div className='relative'>
                        <div aria-hidden='true' className='absolute inset-0 flex items-center'>
                            <span className='w-full border-t' />
                        </div>
                        <div className='relative flex justify-center text-xs uppercase'>
                            <span className='bg-background px-2 text-muted-foreground'>
                                or
                            </span>
                        </div>
                    </div>

                    {isSeller ? (
                        <Button onClick={continueAsBuyer} variant='secondary' disabled={isLoading} className='w-full'>Continue as customer</Button>
                    ) : (
                        <Button onClick={continueAsSeller} variant='secondary' disabled={isLoading} className='w-full'>Continue as seller</Button>
                    )}

                </div>

            </div>

        </>
    )
}

export default Page