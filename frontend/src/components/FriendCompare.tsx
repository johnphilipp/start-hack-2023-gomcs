import { useState } from 'react';

export default function FriendCompare() {
    const [friendName, setFriendName] = useState('');
    const [comparisonData, setComparisonData] = useState(null);

    const compareWithFriend = async () => {
        const response = await fetch('http://localhost:8080/fetch', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ friendName }),
        });
        const data = await response.json();
        setComparisonData(data);
    };

    return (
        <div>
            <label htmlFor="friend-name">Compare with friend:</label>
            <input
                id="friend-name"
                value={friendName}
                onChange={(e) => setFriendName(e.target.value)}
            />
            <button onClick={compareWithFriend}>Compare</button>
            {comparisonData && (
                <div>
                    <h2>You</h2>
                    {/*<p>{comparisonData?.you}</p>*/}
                    <h2>Your Friend</h2>‡
                    {/*<p>{comparisonData?.friend}</p>*/}
                </div>
            )}
        </div>
    );
}
