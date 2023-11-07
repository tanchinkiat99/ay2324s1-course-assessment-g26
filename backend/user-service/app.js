// user-service/backend/app.js
import express from 'express';
import bodyParser from 'body-parser';
import authRoute from './routes/auth.js';
import userRoute from './routes/user.js';
import attemptsRoute from './routes/attempts.js'

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/auth', authRoute);
app.use('/user', userRoute);
app.use('/attempts', attemptsRoute);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
