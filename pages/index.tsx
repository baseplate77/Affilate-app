import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { signIn, useSession, signOut } from "next-auth/react";
import authService from "@/service/authService";
import { Button } from "react-daisyui";
import affiliateService from "@/service/affiliate_service";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const router = useRouter();
  const { data } = useSession();

  // add check coookie exist and expire data

  const handleCheckout = async () => {
    const affiliateId = (affiliateService.getDataFromCookie() as any)
      .affiliateId;
    // console.log("affiliate :", affiliateId);

    let res = await fetch("/api/stripe-checkout", {
      method: "POST",
      body: JSON.stringify({
        affiliateId,
        email: data?.user?.email,
      }),
    });
    // console.log("res : ", await res.json());
    if (res.status === 200) {
      let d = await res.json();
      console.log("data :", d);

      router.replace(d.url);
    }
  };

  return (
    <>
      <Head>
        <title>Affilate Program App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Button onClick={() => handleCheckout()}>Checkout</Button>

      {data === null ? (
        <Button onClick={() => signIn("google")}>Sign in Bro</Button>
      ) : (
        <>
          <div>Welecom {data?.user?.name}</div>
          <Button color="primary" onClick={() => signOut()}>
            Sign Out
          </Button>
        </>
      )}
    </>
  );
}
