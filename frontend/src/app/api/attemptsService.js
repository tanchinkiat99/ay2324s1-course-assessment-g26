import axios from 'axios';

const attemptsServiceClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_EXPRESS_SERVER,
    // other custom settings
});

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
