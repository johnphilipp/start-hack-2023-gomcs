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

  const router = useRouter();

  // This is just mocked for now, but behavior should be similar
  // If you set this to true it will redirect to dashboard
  // So we want to get the true/false from a request to some endpoint that checks if DB has data form user (sessionData.user.id)
  const userHasDataInDB = false;

  if (!sessionData) {
    return <div>Not logged in</div>;
  }

  if (userHasDataInDB) {
    router.push("/dashboard");
  }
  return <UploadData />;
};

export default LoggedIn;
