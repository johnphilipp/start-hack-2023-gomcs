import { useState, useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

// TODO: Fetch data from backend

type Data = {
  id: number;
  name: string;
  email: string;
};

const Dashboard: React.FC = () => {
  const [data, setData] = useState<Data | null>(null);
  const { data: sessionData } = useSession();

  // Just random draft:

  //   useEffect(() => {
  //     const fetchData = async () => {
  //       if (sessionData) {
  //         const response = await fetch("http://localhost:8080/getData", {
  //           method: "GET",
  //           headers: {
  //             "Content-Type": "application/json",
  //             Authorization: `Bearer ${sessionData.accessToken}`,
  //           },
  //         });
  //         const responseData = await response.json();
  //         setData(responseData);
  //       }
  //     };

  //     fetchData();
  //   }, [sessionData]);

  return (
    <div>
      <h1>Welcome to your dashboard, {sessionData?.user?.name}!</h1>
      {/* Just random draft: */}
      {data && (
        <div>
          <p>ID: {data.id}</p>
          <p>Name: {data.name}</p>
          <p>Email: {data.email}</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
