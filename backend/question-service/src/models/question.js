import { Schema, model } from 'mongoose';

const QuestionSchema = new Schema({
  // TODO: ref to user if needed
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    unique: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
  },
  categories: {
    type: [String],
    required: [true, '1 or more categories are required'],
    trim: true,
    // TODO: validation for categories
  },
  complexity: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: [true, 'Complexity is required'],
    trim: true,
  },
});

// Create index for frequently queried fields if needed

const Question = model('Question', QuestionSchema);
export default Question;
