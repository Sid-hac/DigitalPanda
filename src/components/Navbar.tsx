import Link from 'next/link'
import React from 'react'
import MaxWidthWrapper from '@/components/MaxWidthWrapper'

import { icons } from './Icons'
import NavItems from './NavItems'
import { buttonVariants } from './ui/button'
import Cart from './Cart'
import { getServerSideUser } from '@/lib/payload-utils'
import { cookies } from 'next/headers'
import UserAccNav from './UserAccNav'


const Navbar = async () => {

    const nextCookies = cookies()
    const {user} = await getServerSideUser(nextCookies)

    return (
        <div className='bg-white sticky z-50 inset-x-0 top-0 h-16'>
            <header className='relative bg-white'>
                <MaxWidthWrapper>
                    <div className='border-b border-gray-200 px-4 flex justify-between items-center'>
                        <div className='flex h-16 items-center gap-4'>
                            {/* TODO:mobile nav */}
                            <div className='flex '>
                                <Link href='/'>
                                    <icons.logo className='h-12 w-12' />
                                </Link>

                            </div>
                            <div className='hidden sm:flex sm:gap-2 lg:self-stretch'>
                                <NavItems />
                            </div>

                        </div>
                        <div className=' hidden lg:flex lg:justify-center lg:items-center lg:gap-4'>

                            {user ? (null) :

                                (<Link href='/sign-in' className={buttonVariants({ variant: 'ghost' })}>
                                    Sign-in
                                </Link>)
                            }
                            {user ? null :
                                <span className='h-6 w-px bg-gray-200' aria-hidden='true' />
                            }
                            {user ? (
                                <UserAccNav user={user}/>
                            ) :
                                (<Link  href='/sign-up' className={buttonVariants({ variant: 'ghost'})}>
                                    Sign-up
                                </Link>)
                            }
                        {user ?( <span className='h-6 w-px bg-gray-200' aria-hidden='true' />) :
                            null

                        }
                        {user ? null :
                            (
                                <span className='h-6 w-px bg-gray-200' aria-hidden='true' />
                            )
                        }
                        <div className=' lg:flex '>
                            <Cart />
                        </div>


                    </div>

                </div>
            </MaxWidthWrapper>

        </header>
        </div >
    )
}

export default Navbar