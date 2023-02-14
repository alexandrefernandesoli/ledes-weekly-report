import React, { ReactNode } from 'react';
import { Header } from './Header';

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />

      <main className="flex w-full min-h-[calc(100%-64px)] flex-col bg-primary text-gray-100 px-6">
        {children}
      </main>
    </>
  );
}
