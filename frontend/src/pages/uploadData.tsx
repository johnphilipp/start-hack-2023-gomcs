import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Spinner from "~/components/Spinner";
import { NextPage } from "next";
import Header from "~/components/Header";
import UploadData from "~/components/UploadData";
import {useState} from "react";

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
      <Header />
      <div className="bg-gradient-to-b from-[#40c057] to-[#15162c]">
        <main className="mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center p-6 lg:px-8">
          <UploadData />
        </main>
      </div>
    </>
  );
};
export default UploadDataPage;
