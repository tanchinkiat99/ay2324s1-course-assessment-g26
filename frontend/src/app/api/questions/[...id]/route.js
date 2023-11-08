import axios from 'axios';
import { getToken } from 'next-auth/jwt';
import jwt from 'jsonwebtoken';

// GET, PATCH and DELETE
export async function GET(req, { params }) {
  // console.log(params.id);
  const token = await getToken({
    req: req,
    secret: process.env.NEXTAUTH_SECRET,
  });
  // console.log('token', token);
  const encoded = jwt.sign({ role: token.role_type }, process.env.JWT_SECRET);

  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_QUESTION_BACKEND_URL}/questions/${params.id}`,
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

export async function PATCH(req, res, { params }) {
  // console.log(params.id);
  const token = await getToken({
    req: req,
    secret: process.env.NEXTAUTH_SECRET,
  });
  // console.log('token', token);
  const encoded = jwt.sign({ role: token.role_type }, process.env.JWT_SECRET);

  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_QUESTION_BACKEND_URL}/questions/${params.id}`,
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

export async function DELETE(request) {}
