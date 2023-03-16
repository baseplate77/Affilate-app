import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import affiliateService from "@/service/affiliate_service";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const route = useRouter();
  useEffect(() => {
    const { via } = route.query;
    if (via !== undefined) {
      affiliateService.cookies(via as any);
      console.log("affiliate id :", via);
    }
  }, [route]);

  useEffect(() => {
    affiliateService.getDataFromCookie();
  });

  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
