require('dotenv').config();
const express = require('express');
const tradingBot = require('./tradingBot');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/start-bot', (req, res) => {
  tradingBot.start();
  res.send('Trading bot started.');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});