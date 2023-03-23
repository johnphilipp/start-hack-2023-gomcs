import React, { useState, useCallback } from "react";
import { useRouter } from "next/router";
import { signIn, signOut, useSession } from "next-auth/react";

import { useDropzone, FileWithPath } from "react-dropzone";
import { BsFiletypeJson } from "react-icons/bs";
import { FiUpload } from "react-icons/fi";

const UploadData: React.FC = () => {
  const { data: sessionData } = useSession();

  const router = useRouter();

  const [uploadedFile, setUploadedFile] = useState<File>();
  const [success, setSuccess] = useState<boolean>(false);

  const handleFileUpload = useCallback((files: FileList) => {
    const file = files[0];
    if (!file) return;

    setUploadedFile(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles: FileWithPath[]) =>
      handleFileUpload(acceptedFiles as unknown as FileList),
    accept: {
      "application/zip": [".zip"],
    },
    maxFiles: 1,
  });

  const handleUploadData = async () => {
    if (sessionData && uploadedFile) {
      try {
        const formData = new FormData();
        formData.append("file", uploadedFile, uploadedFile.name);

        const response = await uploadDataHelper(sessionData.user.id, formData);

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
    <div className="flex flex-col items-center justify-center gap-4 text-white">
      <h2 className="mb-2 text-xl font-bold">Upload Data</h2>
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
              <p className="pl-2">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">ZIP</p>
          </div>
        </div>
      </div>
      {uploadedFile?.name && (
        <p className="text-white">Uploaded file: {uploadedFile.name}</p>
      )}
      {uploadedFile && sessionData && (
        <>
          <button
            type="button"
            className="inline-flex items-center gap-x-1.5 rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
            onClick={() => handleUploadData()}
          >
            <FiUpload className="-ml-0.5 h-5 w-5" aria-hidden="true" />
            Upload Data
            {/* Prev. called: "Populate Dashboard" -- I think this sounded nicer */}
          </button>
        </>
      )}
      {success && (
        <p className="text-green-500">Data uploaded successfully!</p> // conditionally render success message
      )}
    </div>
  );
};

export default UploadData;

const uploadDataHelper = async (userId: string, formData: FormData) => {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/upload_zip/${userId}`;
  // const url = "http://192.168.43.228:8080/uploadJsonTimeline";

  const requestOptions = {
    method: "POST",
    body: formData,
  };

  const response = await fetch(url, requestOptions);

  return response;
};
