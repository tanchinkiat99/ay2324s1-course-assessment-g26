import dotenv from 'dotenv';
import app from './app.js';

const envPath = process.env.NODE_ENV === 'development' ? '.env.local' : '.env';
dotenv.config({ path: envPath });
const port = process.env.PORT || 5000;

app.listen(port, () =>
  console.log(`Question service server started on port ${port}`)
);
