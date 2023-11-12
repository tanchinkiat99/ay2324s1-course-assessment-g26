import { useState } from "react";

const AttemptsList = ({ attemptHistory }) =>
{
    // States for attempt history feature
    const [showAllAttempts, setShowAllAttempts] = useState(false);

    // Toggle the attempts view when there are more than 5 attempts
    const toggleAttemptsView = () => {
        setShowAllAttempts(!showAllAttempts);
    };

    return (
    <div className="w-1/2 mt-8">
        <h2 className="text-2xl mb-4">Attempt History</h2>
        <table className="min-w-full">
            <thead>
            <tr>
                <th className="text-left p-2">Question Title</th>
                <th className="text-left p-2">Attempt Date</th>
            </tr>
            </thead>
            <tbody>
            {(showAllAttempts ? attemptHistory : attemptHistory.slice(0, 5)).map((attempt, index) => (
                <tr key={index}>
                    <td className="p-2">{attempt.question_title}</td>
                    <td className="p-2">{new Date(attempt.attempt_datetime).toLocaleString()}</td>
                </tr>
            ))}
            </tbody>
        </table>
        {attemptHistory.length > 5 && (
            <button
                className="mt-4 px-3 py-1 text-white bg-blue-600 hover:bg-blue-700 rounded"
                onClick={toggleAttemptsView}
            >
                {showAllAttempts ? 'Show Less' : 'View More'}
            </button>
        )}
    </div>
    );
}

export default AttemptsList;
