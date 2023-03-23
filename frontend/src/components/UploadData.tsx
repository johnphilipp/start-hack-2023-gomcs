import React, { useState, useCallback } from "react";
import { useRouter } from "next/router";
import { signIn, signOut, useSession } from "next-auth/react";

import { useDropzone, FileWithPath } from "react-dropzone";
import { BsFiletypeJson } from "react-icons/bs";
import { FiUpload } from "react-icons/fi";

const UploadData: React.FC = () => {
  console.log("HERE!");
  const { data: sessionData } = useSession();

  const router = useRouter();

  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  console.log({ uploadedFileName });
  console.log({ uploadedFile });
  console.log({ success });

  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    acceptedFiles.forEach((file) => {
      console.log("Accepted file:", file);
      setUploadedFileName(file.name);

      const reader = new FileReader();
      reader.onload = () => {
        const fileContent = reader.result as string;
        // console.log("File content:", fileContent);
        setUploadedFile(fileContent);
      };
      reader.readAsText(file);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/json": [".json"],
    },
  });

  const handleUploadData = async () => {
    console.log("Upload data button clicked");
    if (sessionData && uploadedFile) {
      try {
        const response = await uploadDataHelper(
          sessionData.user.id,
          uploadedFile
        );

        if (response.ok) {
          setSuccess(true);
          router.push("/dashboard");
        } else {
          throw new Error("Network response was not ok");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
      </p>
      <button
        className="mb-8 rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        Log out
      </button>
      <div
        {...getRootProps()}
        className={`mt-2 sm:col-span-2 sm:mt-0 ${
          isDragActive ? "bg-green-100" : "bg-white/10"
        }`}
      >
        <div className="flex max-w-lg justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
          <div className="space-y-1 text-center">
            <BsFiletypeJson className="mx-auto mb-4 h-16 w-12 text-gray-400" />
            <div className="flex text-sm text-gray-600">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
              >
                <span className="p-1">Upload a file</span>
                <input
                  {...getInputProps()}
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                />
              </label>
              <p className="pl-2">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">JSON</p>
          </div>
        </div>
      </div>
      {uploadedFileName && (
        <p className="text-white">Uploaded file: {uploadedFileName}</p>
      )}
      {uploadedFile && sessionData && (
        <button
          type="button"
          className="inline-flex items-center gap-x-1.5 rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
          onClick={() => handleUploadData()}
        >
          <FiUpload className="-ml-0.5 h-5 w-5" aria-hidden="true" />
          Upload Data
          {/* Prev. called: "Populate Dashboard" -- I think this sounded nicer */}
        </button>
      )}
      {success && (
        <p className="text-green-500">Data uploaded successfully!</p> // conditionally render success message
      )}
    </div>
  );
};

export default UploadData;

const uploadDataHelper = async (userId: string, timeline: string) => {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploadJsonTimeline`;
  // const url = "http://192.168.43.228:8080/uploadJsonTimeline";

  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, timeline }),
  };

  const response = await fetch(url, requestOptions);

  return response;
};
