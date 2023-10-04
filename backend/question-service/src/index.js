import dotenv from 'dotenv';
import app from './app.js';

dotenv.config({ path: '.env.local' });
// dotenv.config();

// console.log(process.env.MONGODB_URI);
const port = process.env.PORT || 5000;

app.listen(port, () =>
  console.log(`Server started on http://localhost:${port}/`)
);
