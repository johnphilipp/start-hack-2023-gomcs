import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const DeleteData: React.FC = () => {
  const { data: sessionData, status } = useSession();
  const userId = sessionData?.user?.id;

  const router = useRouter();

  const handleClick = async () => {
    if (userId) {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/${userId}`,
        {
          method: "DELETE",
        }
      );

      if (response.status === 200) {
        console.log(`Successfully deleted data for user ${userId}`);
        router.push("/uploadData");
      } else {
        console.error(`Error deleting data for user ${userId}`);
      }
    }
  };

  return (
    <div>
      <button
        className="-m-2.5 inline-flex items-center justify-center rounded-md bg-white p-2.5 text-gray-900 hover:bg-gray-300"
        onClick={handleClick}
      >
        Delete Data
      </button>
    </div>
  );
};

export default DeleteData;
