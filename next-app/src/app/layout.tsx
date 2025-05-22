'use client'; // Ensure this is client-side rendering
import './globals.css';
import { Roboto } from 'next/font/google';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '@/theme';
import CssBaseline from '@mui/material/CssBaseline';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

const roboto = Roboto({
  variable: '--font-roboto',
  subsets: ['latin'],
});

// Global Layout file, good for headers, footers, global data etc.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <html lang="en" className={roboto.variable}>
      <body>
        <AppRouterCacheProvider>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={theme}>
              {/* Baseline for theme */}
              <CssBaseline />
              {/* <div>
              <p>Header</p>
            </div> */}
              {children}
              {/* <div>
              <p>Footer</p>
            </div> */}
            </ThemeProvider>
          </QueryClientProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
