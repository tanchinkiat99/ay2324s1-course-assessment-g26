import axios from 'axios';
import { getToken } from 'next-auth/jwt';
import jwt from 'jsonwebtoken';

export async function PATCH(req) {
  const token = await getToken({
    req: req,
    secret: process.env.NEXTAUTH_SECRET,
  });
  // console.log('token', token);
  const encoded = jwt.sign({ role: token.role_type }, process.env.JWT_SECRET);
  const body = await req.json();
  // console.log(body);
  const response = await axios.patch(
    `${process.env.NEXT_PUBLIC_QUESTION_BACKEND_URL}/questions/${body.id}`,
    body,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${encoded}`,
      },
    }
  );
  if (response.status !== 200) {
    throw new Error(error.response?.data?.message);
    // console.log('ERROR');
  }

  return Response.json(response.data);
}
