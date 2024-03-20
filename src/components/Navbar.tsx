import Link from 'next/link'
import React from 'react'
import MaxWidthWrapper from '@/components/MaxWidthWrapper'

import { icons } from './Icons'
import NavItems from './NavItems'

const Navbar = () => {
    return (
        <div className='bg-white sticky z-50 inset-x-0 top-0 h-16'>
            <header className='relative bg-white'>
                <MaxWidthWrapper>
                    <div className='border-b border-gray-200 px-4'>
                        <div className='flex h-16 items-center'>
                            {/* TODO:mobile nav */}
                            <div className='flex '>
                                <Link href='/'>
                                    <icons.logo className='h-12 w-12' />
                                </Link>

                            </div>
                            <div className='hidden sm:flex sm:gap-2 lg:self-stretch'>
                              <NavItems/>
                            </div>

                        </div>
                    </div>
                </MaxWidthWrapper>

            </header>
        </div>
    )
}

export default Navbar