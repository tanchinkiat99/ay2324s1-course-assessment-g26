import { useState, useEffect } from 'react';

const Countdown = ({ startCountdown }) => {
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    if (startCountdown && countdown > 0) {
      setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
  }, [countdown, startCountdown]);

  return <div>{countdown}</div>;
};

export default Countdown;
