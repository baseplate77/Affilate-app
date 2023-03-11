import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Head>
        <title>Affilate Program App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>some thinks will go here</div>
    </>
  );
}
