const express = require('express');

const app = express();
const PORT = 4000;
let lowerLimit=100;
let UpperLimit=500;

// API for generating mock stock price in the range [LowerLimit-UpperLimit]
app.get('/mock-stock-price', (req, res) => {
  const price = Math.floor(Math.random() * (UpperLimit - lowerLimit + 1)) + 100;
  res.json({ price });
});

app.listen(PORT, () => {
  console.log(`Mock API running on port ${PORT}`);
});