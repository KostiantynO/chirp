import { ClerkProvider } from '@clerk/nextjs';
import { Inter } from 'next/font/google';
import { cookies } from 'next/headers';
import { Toaster } from 'react-hot-toast';

import '~/styles/globals.css';
import { TRPCReactProvider } from '~/trpc/react';

import type { Metadata } from 'next';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Chirp',
  description: 'Generated by create-t3-app',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
};

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <ClerkProvider>
    <html lang="en">
      <body className={`font-sans ${inter.variable}  `}>
        <TRPCReactProvider cookies={cookies().toString()}>
          <main className="flex h-full justify-center ">
            <div className="h-full w-full border-x border-slate-400 md:max-w-2xl">
              {children}
            </div>
          </main>
        </TRPCReactProvider>
        <Toaster position="bottom-center" />
      </body>
    </html>
  </ClerkProvider>
);

export default RootLayout;
