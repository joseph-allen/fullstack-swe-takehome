import { ReactNode } from 'react';
import { roboto } from '@/lib/fonts';
import Providers from '@/app/providers';

// SSR layout
export const metadata = {
  title: 'Queue App',
  description: 'A queue management app',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={roboto.className}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
