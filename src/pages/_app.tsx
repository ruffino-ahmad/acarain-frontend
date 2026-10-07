import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { HeroUIProvider } from "@heroui/react";
import { Inter } from "next/font/google";
import { cn } from "@/utils/cn";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <HeroUIProvider>
          <main className={cn(inter.className)}>
            <Component {...pageProps} />
          </main>
        </HeroUIProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
