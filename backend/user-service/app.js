// user-service/backend/app.js
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import authRoute from './routes/auth.js';
import userRoute from './routes/user.js';
import attemptRoute from './routes/attempt.js'

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/auth', authRoute);
app.use('/user', userRoute);
app.use('/attempts', attemptRoute);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
