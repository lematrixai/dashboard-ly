import { Loader2 } from 'lucide-react'
import React from 'react'

const loading = () => {
  return (
    <>
        <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900 dark:border-white">
                <Loader2 className="size-10" />
            </div>
        </div>
    </>
  )
}

export default loading