import React, { ReactNode } from 'react'
import { Header } from './Header'

export default function MainLayout({ children }: { children?: ReactNode }) {
  return (
    <div className="-z-20 flex min-h-screen flex-col items-center bg-neutral-200 ">
      <Header />

      <main className="z-10 mt-16 flex w-11/12 flex-col bg-neutral-100 p-6 text-gray-800 ">
        {children}
      </main>
    </div>
  )
}
