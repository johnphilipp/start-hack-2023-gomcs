import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

type Activity = {
  activityType: string;
  distance: number;
  confidence: string;
  startTime: string;
  endTime: string;
};

const Analytics: React.FC = () => {
  const { data: sessionData, status } = useSession();

  const [timelineData, setTimelineData] = useState<Activity[]>([]);

  useEffect(() => {
    if (sessionData) {
      const userId = sessionData.user.id;
      const fetchData = async () => {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/loadTimeline/${userId}`
        );
        const data = await response.json();
        setTimelineData(data);
      };
      fetchData();
    }
  }, []);

  return (
    <div className="text-white">
      <h1>Timeline</h1>
      <table>
        <thead>
          <tr>
            <th>Activity Type</th>
            <th>Distance</th>
            <th>Confidence</th>
            <th>Start Time</th>
            <th>End Time</th>
          </tr>
        </thead>
        <tbody>
          {timelineData.map((activity, index) => (
            <tr key={index}>
              <td>{activity.activityType}</td>
              <td>{activity.distance}</td>
              <td>{activity.confidence}</td>
              <td>{activity.startTime}</td>
              <td>{activity.endTime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Analytics;
