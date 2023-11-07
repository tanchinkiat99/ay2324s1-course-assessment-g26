import axios from 'axios';

const userServiceClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_EXPRESS_SERVER,
    // other custom settings
});

export const updateUser = async (email, name) => {
    try {
        console.log(`Updating user ${email}'s name to ${name}`);
        const response = await userServiceClient.put(
            `/user/${email}`, {name: name}
        );
        return response;
    } catch (error) {
        throw new Error(error.response?.data?.message);
    }
};

export const deleteUser = async (email) => {
    try {
        const response = await userServiceClient.delete(
            `/user/${email}`);
        return response;
    } catch (error) {
        throw new Error(error.response?.data?.message);
    }
}