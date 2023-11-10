import express, { json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import questionRoutes from './routes/questionRoutes.js';
import seedQuestions from './samples.js';
import Question from './models/question.js';
import { verifyRole } from './middlewares/verifyRole.js';

const envPath = process.env.NODE_ENV === 'development' ? '.env.local' : '.env';
dotenv.config({ path: envPath });

// console.log(process.env.MONGODB_URI);
const app = express();
// Use the cors middleware and configure it
// If you know the origin of your frontend, you can specify it:
// app.use(cors({ origin: 'http://your-frontend-url.com' }));
// For development purposes, you might allow all origins:
app.use(cors());

// Replaces body-parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Seed database with sample questions
async function seedDatabase() {
  const count = await Question.countDocuments();

  if (count === 0) {
    await Question.insertMany(seedQuestions);
    console.log('Database seeded with sample questions.');
  }
}

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    dbName: 'peerprep',
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
    return seedDatabase();
  })
  .catch((error) => {
    console.error('Could not connect to MongoDB', error);
  });

// Routes setup
app.use('/questions', questionRoutes);
app.get('/', (_, res) => {
  res.send('QUESTION SERVICE IS RUNNING');
});

app.get;

export default app;
