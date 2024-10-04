require('dotenv').config();
const express = require('express');
const { startBot, stopBot, getSummaryReport } = require('./tradingBot');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for error handling
const errorHandler = (err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'An unexpected error occurred. Please try again later.' });
};

// Starting trading bot with a selected strategy
app.get('/start-bot/:strategy', (req, res, next) => {
  const strategy = req.params.strategy;
  try {
    startBot(strategy);
    res.send(`Trading bot started with ${strategy} strategy.`);
  } catch (err) {
    next(err);
  }
});

// Stopping the trading bot
app.get('/stop-bot', (req, res, next) => {
  try {
    stopBot();
    res.send('Trading bot stopped.');
  } catch (err) {
    next(err);
  }
});

// Getting summary report of trades
app.get('/report', (req, res, next) => {
  try {
    const report = getSummaryReport();
    res.json(report);
  } catch (err) {
    next(err);
  }
});

// Use the error handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});