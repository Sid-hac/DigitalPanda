
"use client"

import { icons } from '@/components/Icons'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import Link from 'next/link'
    ;

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { authCredentialValidator, TauthCredentialValidator } from '@/lib/validators/acc-cred'
import { trpc } from '@/trpc/client'

const Page = () => {



    const { register, handleSubmit, formState: { errors } } = useForm<TauthCredentialValidator>({
        resolver: zodResolver(authCredentialValidator),
    })

    const { mutate, isLoading } = trpc.auth.createPayloadUser.useMutation({})

    const onsubmit = ({ email, password }: TauthCredentialValidator) => {
        //   send data to server
        mutate({
            email,
            password
        })
    }




return (
    <>
        <div className="container flex flex-col justify-center items-center p-10">
            <div className="w-full flex flex-col justify-center items-center sm:w-[350px] space-y-6 ">
                <div className="flex flex-col text-center justify-center items-center">
                    <icons.logo className="h-12 w-12" />
                    <h1 className="text-2xl font-bold">Create an account</h1>
                    <p className='text-sm '>
                        Already have an account?
                        <span className='text-sm font-semibold text-muted-foreground '>
                            <Link href="/sign-in" className={buttonVariants({
                                variant: 'link',
                            })}>
                                Sign-In

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
                        </div>
                        <Button>Sign up</Button>
                    </div>
                </form>
            </div>

        </div>
    </>
   )}

export default Page