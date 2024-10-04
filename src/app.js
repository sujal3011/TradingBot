require('dotenv').config();
const express = require('express');
const { startBot, stopBot, getSummaryReport } = require('./tradingBot');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/start-bot', (req, res) => {
  startBot();
  res.send('Trading bot started.');
});

app.get('/stop-bot', (req, res) => {
  stopBot();
  res.send('Trading bot stopped.');
});

app.get('/report', (req, res) => {
  const report = getSummaryReport();
  res.json(report);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
