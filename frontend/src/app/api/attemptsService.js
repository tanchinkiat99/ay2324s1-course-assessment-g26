import axios from 'axios';

const attemptsServiceClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_EXPRESS_SERVER,
    // other custom settings
});

export const createAttemptRecord = async (email, question_id, question_title) => {
  try {
      console.log(`Creating new attempt for question ${question_id}:${question_title} by ${email}`);
      const response = await attemptsServiceClient.post(
          `attempts/${email}`, {question_id: question_id, question_title: question_title}
      );
      return response;

  } catch (error) {
      throw new Error(error.response?.data?.message);
  }
};

export const getAttemptHistory = async (email) => {
    try {
        console.log(`Retrieving attempt history for ${email}`);
        const response = await attemptsServiceClient.get(
            `/attempts/${email}`
        );
        return response;
    } catch (error) {
        throw new Error(error.response?.data?.message);
    }
};
