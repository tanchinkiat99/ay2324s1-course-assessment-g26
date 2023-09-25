// import { connectToDB } from '@utils/database';
import Question from '@models/question';

export const POST = async (req) => {
  //   const { title, description, categories, complexity } = await req.body;

  //   try {
  //     // Need to connect everything its called
  //     await connectToDB();
  //     const newQuestion = new Question({
  //       title,
  //       description,
  //       categories,
  //       complexity,
  //     });
  //     // Save to MongoDB, collection automatically created for first save
  //     await newQuestion.save();
  //     return new Response(JSON.stringify(newQuestion), { status: 201 });
  //   } catch (error) {
  //     return new Response('Failed to create a new question', { status: 500 });
  //   }
  // };
  const newQuestion = new Question(
    'Fake question',
    'Fake description',
    ['Fake categories'],
    'Easy'
  );
};
