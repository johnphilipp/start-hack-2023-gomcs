import React, { useEffect } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import Spinner from "~/components/Spinner";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";

const Home: NextPage = () => {
  const { data: sessionData, status } = useSession();

  const router = useRouter();

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (sessionData) {
    console.log(
      "DEBUG: [/index] sessionData available -- routing to /dashboard"
    );
    router.push("/dashboard");
  }

  return (
    <>
      <Head>
        <title>Timeliner</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Timeliner
          </h1>

          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-[2rem]">
            {" "}
            /index
          </h2>

          <div className="flex flex-col items-center justify-center gap-4">
            <p className="text-center text-2xl text-white">Not logged in</p>
            <button
              className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
              onClick={() => void signIn()}
            >
              Log in
            </button>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
