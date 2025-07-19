import { Loader2 } from 'lucide-react'
import React from 'react'

const loading = () => {
  return (
    <>
        <div className="flex items-center justify-center h-screen bg-white">
            <Loader2 className="size-10 animate-spin text-primary" />
        </div>
    </>
  )
}

export default loading