import axios from 'axios';
import jwt from 'jsonwebtoken';

// console.log('process.env', process.env.NEXT_PUBLIC_QUESTION_BACKEND_URL);
const questionServiceClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_QUESTION_BACKEND_URL,
  // other custom settings
});

export const getAllQuestions = async (roleType) => {
  const response = await questionServiceClient.get('/questions', {
    headers: {
      Authorization: `Bearer ${roleType}`,
    },
  });
  if (response.status !== 200) {
    throw new Error(error.response?.data?.message);
  }
  return response.data;
};

export const getQuestionById = async (id, userToken) => {
  const response = await questionServiceClient.get(`/questions/${id}`, {
    headers: {
      Authorization: `Bearer ${userToken}`,
    },
  });
  if (response.status !== 200) {
    throw new Error(error.response?.data?.message);
  }
  return response.data;
};

export const createQuestion = async (post, userToken) => {
  const response = await questionServiceClient.post('/questions/new', post, {
    headers: {
      Authorization: `Bearer ${userToken}`,
    },
  });
  if (response.status !== 201) {
    throw new Error(error.response?.data?.message);
  }
  return response.data;
};

export const updateQuestion = async (questionId, post, userToken) => {
  try {
    const response = await questionServiceClient.patch(
      `/questions/${questionId}`,
      post,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message);
  }
};

export const deleteQuestion = async (id, userToken) => {
  const response = await questionServiceClient.delete(`/questions/${id}`, {
    headers: {
      Authorization: `Bearer ${userToken}`,
    },
  });
  if (response.status !== 200) {
    throw new Error(error.response?.data?.message);
  }
  return response.data;
};
