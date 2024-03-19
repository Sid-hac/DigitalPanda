import { cn } from '@/lib/utils'
import React from 'react'

const maxwidthwrapper = ({
    classname,
    children
}:{
    classname?: string,
    children: React.ReactNode
}) => {
  return (
    <div className={cn('w-full mx-auto max-w-screen-xl px-2 md:px-20' , classname)}>
      {children}
    </div>
  )
}

export default maxwidthwrapper