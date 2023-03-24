import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function FriendCompare() {
  const { data: sessionData, status } = useSession();

  const [friendId, setFriendId] = useState("");
  const [comparisonData, setComparisonData] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (sessionData) {
      const userId = sessionData.user.id;

      const fetchData = async () => {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/stats/all/${userId}`
        );

        if (response.status !== 200) {
          <>No Data</>;
          return;
        }

        const data = await response.json();
        setUserData(data);

        console.log({ data });
      };
      fetchData();
    }
  }, [sessionData]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/stats/all/${friendId}`
    );

    console.log(response);

    if (response.status !== 200) {
      <>No Data</>;
      return;
    }

    const comparisonData = await response.json();
    setComparisonData(comparisonData);

    console.log({ comparisonData });
  };

  return (
    <div className="w-full items-center justify-center">
      <form onSubmit={handleSubmit}>
        <label
          htmlFor="friend-name"
          className="block text-sm font-medium leading-6 text-white"
        >
          Compare with friend:
        </label>
        <br />
        <div className="">
          <input
            id="friend-name"
            value={friendId}
            onChange={(e) => setFriendId(e.target.value)}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:pl-4 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="userId of your friend goes here :)"
          />
        </div>
        <br />
        <button
          type="submit"
          className="mb-8 block w-full rounded-lg bg-gray-100 py-2.5 px-3 text-base font-semibold leading-7 text-black hover:bg-gray-400 hover:text-white"
        >
          Compare
        </button>
      </form>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-900 p-4">{!!userData && <>User Data</>}</div>
        <div className="bg-green-900 p-4 ">
          {!!comparisonData && <>Friend Data</>}
        </div>
      </div>
    </div>
  );
}
