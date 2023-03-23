import React, { useState, useCallback } from "react";
import { useRouter } from "next/router";
import { signIn, signOut, useSession } from "next-auth/react";

import { useDropzone, FileWithPath } from "react-dropzone";
import { BsFiletypeJson } from "react-icons/bs";
import { FiUpload } from "react-icons/fi";
import UploadData from "./UploadData";

// TODO: FIRST check if user already has data in the database
// TODO: If yes, then reroute to dashboard and fetch data there
// TODO: If no, then show the upload file component (already implemented)

const LoggedIn: React.FC = () => {
  const { data: sessionData } = useSession();
  const [userHasDataInDB, setUserHasDataInDB] = useState<boolean>(false);

  const router = useRouter();

  if(!!sessionData?.user.id) {
    requestUserData(sessionData?.user.id).then((response: Response) => {
      if(response.ok) setUserHasDataInDB(true)
      else setUserHasDataInDB(false)
    })
  }

  if (!sessionData) {
    return <div>Not logged in</div>;
  }

  if (userHasDataInDB) {
    router.push("/dashboard");
  }
  return <UploadData />;
};

const requestUserData = async (userId: string) => {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/timeline/${userId}`;
  console.log(`Make user data request ${url}`)

  const response = await fetch(url);

  console.log(response)

  return response;
};

export default LoggedIn;
