const express = require('express');
const app = express();
const PORT = 5000;
const cors = require('cors');
// Use the cors middleware and configure it
// If you know the origin of your frontend, you can specify it:
// app.use(cors({ origin: 'http://your-frontend-url.com' }));
// For development purposes, you might allow all origins:
app.use(cors());
app.use(express.json());

// Set up a route for `/question/new` to return "hello world".
app.get('/question/new', (req, res) => {
  res.send('hello world');
  console.log('sent hello world');
});

// POST route to handle incoming data
app.post('/question/new', (req, res) => {
  console.log('POST request received at /question/new');
  console.log('Data received:', req.body);
  res.json({ status: 'success', data: req.body });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
