// main.js or your entry file
const express = require('express');
const cors = require('cors');
const Routes = require('./Services/routes/routes'); 

const app = express();
const port = 3000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'], 
  allowedHeaders: ['Content-Type', 'Authorization'], 
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.send("Welcome to Firebase Server!");
});

app.use('/', Routes);



app.listen(port, () => {
  console.log(`API server running at http://localhost:${port}`);
});
