import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { HeroUIProvider } from "@heroui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import AppShell from "@/components/commons/AppShell";
import { ToasterProvider } from "@/contexts/ToasterContext";

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
          <ToasterProvider>
            <AppShell>
              <Component {...pageProps} />
            </AppShell>
          </ToasterProvider>
        </HeroUIProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
