import axios from 'axios';
import { getToken } from 'next-auth/jwt';
import jwt from 'jsonwebtoken';

export async function GET(request) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  // console.log('token', token);
  const encoded = jwt.sign({ role: token.role_type }, process.env.JWT_SECRET);

  const response = await axios.get(
    new URL('questions', process.env.NEXT_PUBLIC_QUESTION_BACKEND_URL).href,
    {
      headers: {
        Authorization: `Bearer ${encoded}`,
      },
    }
  );
  if (response.status !== 200) {
    throw new Error(error.response?.data?.message);
  }

  return Response.json(response.data);
}
