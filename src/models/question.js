import { Schema, model, models } from 'mongoose';

const QuestionSchema = new Schema({
  // TODO: ref to user if needed
  title: {
    type: String,
    required: [true, 'Title is required'],
  }, 
  description: {
    type: String,
    required: [true, 'Description is required'],
  }, 
  categories: {
    type: [String],
    required: [true, '1 or more categories are required'],
  }, 
  complexity: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: [true, 'Complexity is required'],
  }, 
});

// Create model if it does not exist
const Question = models.Question || model('Question', QuestionSchema);
export default Question;
