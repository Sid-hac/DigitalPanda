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
    <div className={cn('w-full  max-w-screen' , classname)}>
      {children}
    </div>
  )
}

export default maxwidthwrapper