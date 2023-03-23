import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Spinner from "~/components/Spinner";
import { NextPage } from "next";
import Header from "~/components/Header";
import Dashboard from "~/components/Dashboard";

const FriendComparePage: NextPage = () => {
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
      <div className="bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <main className="mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center p-6 text-white lg:px-8">
          Friend Compare :)
        </main>
      </div>
    </>
  );
};
export default FriendComparePage;
