import React from "react";
import UploadData from "../components/UploadData";
import { NextPage } from "next";
import Head from "next/head";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Spinner from "~/components/Spinner";

const UploadDataPage: NextPage = () => {
  const { data: sessionData, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!sessionData) {
    router.push("/");
    return null;
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
            /uploadData
          </h2>

          <div className="flex flex-col items-center gap-2">
            {sessionData && <UploadData />}
          </div>
        </div>
      </main>
    </>
  );
};

export default UploadDataPage;