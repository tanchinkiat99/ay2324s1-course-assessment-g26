import express from 'express';
import bodyParser from 'body-parser';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config({path: '.env'});

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const openai = new OpenAI({ key: process.env.OPENAI_API_KEY});

app.get('/', (_, res) => {
  res.send('CHATGPT SERVICE IS RUNNING');
});

app.post('/', async function (req, res) {
    const query = req.body.message;
    const response = await openai.chat.completions.create({
     model: "gpt-4",
     messages: [{ role: 'user', content: query }],
    });
    const reply = response.choices[0].message.content;
    res.send(reply);
});

const port = process.env.PORT || 4444;

app.listen(port, () =>
    console.log(`Server started on http://localhost:${port}/`)
);