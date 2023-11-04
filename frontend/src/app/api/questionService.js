import axios from 'axios';
import { getSession } from 'next-auth/react';

// console.log('process.env', process.env.NEXT_PUBLIC_QUESTION_BACKEND_URL);
const questionServiceClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_QUESTION_BACKEND_URL,
  // other custom settings
});

// // Add a request interceptor to include the token
// questionServiceClient.interceptors.request.use(
//   async (config) => {
//     // Get the current session
//     const session = await getSession();
//     if (session) {
//       // If there is a session, set the Authorization header
//       config.headers.Authorization = `Bearer ${session.accessToken}`;
//     }
//     return config;
//   },
//   (error) => {
//     // Do something with request error
//     return Promise.reject(error);
//   }
// );

export const getAllQuestions = async () => {
  const response = await questionServiceClient.get('/questions');
  if (response.status !== 200) {
    throw new Error(error.response?.data?.message);
  }
  return response.data;
};

export const getQuestionById = async (id) => {
  const response = await questionServiceClient.get(`/questions/${id}`);
  if (response.status !== 200) {
    throw new Error(error.response?.data?.message);
  }
  return response.data;
};

export const createQuestion = async (post) => {
  const response = await questionServiceClient.post('/questions/new', post);
  if (response.status !== 201) {
    throw new Error(error.response?.data?.message);
  }
  return response.data;
};

export const updateQuestion = async (questionId, post) => {
  try {
    const response = await questionServiceClient.patch(
      `/questions/${questionId}`,
      post
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message);
  }
};

export const deleteQuestion = async (id) => {
  const response = await questionServiceClient.delete(`/questions/${id}`);
  if (response.status !== 200) {
    throw new Error(error.response?.data?.message);
  }
  return response.data;
};
