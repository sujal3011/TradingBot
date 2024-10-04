const axios = require('axios');
// const logger = require('./logger');
require('dotenv').config();

let balance = 10000;  // Starting balance
let stockQuantity = 0;
let lastPrice = null;
let trades = [];
let profitLoss = 0;
let intervalId = null;  // To control the bot
let botActive = false;  // To check if the bot is active
let prices = [];  // Array to store prices for moving average calculation
const MOVING_AVERAGE_PERIOD = 5;  // Number of periods for moving average
let selectedStrategy = null; 

const MOCK_API_URL = process.env.MOCK_API_URL || "https://api.mock.com/stock";

// Mock function to simulate fetching stock price
async function fetchStockPrice() {
  const response = await axios.get(MOCK_API_URL);
  return response.data.price;
}

// Simple strategy: buying when price drops by 2%, selling when it rises by 3%
async function evaluateSimpleStrategy() {
  if (!botActive) return;

  const currentPrice = await fetchStockPrice();

  if (!lastPrice) {
    lastPrice = currentPrice;  // Setting initial price
    return;
  }

  const priceChange = ((currentPrice - lastPrice) / lastPrice) * 100;

  if (priceChange <= -2 && balance >= currentPrice) {
    // Buy
    const quantity = Math.floor(balance / currentPrice);
    stockQuantity += quantity;
    balance -= quantity * currentPrice;
    trades.push({ type: 'buy', price: currentPrice, quantity, time: new Date() });
    // logger.info(`Bought ${quantity} stocks at ${currentPrice}`);
    console.log(`Bought ${quantity} stocks at ${currentPrice}`);
  } else if (priceChange >= 3 && stockQuantity > 0) {
    // Sell
    balance += stockQuantity * currentPrice;
    profitLoss += (currentPrice - lastPrice) * stockQuantity;
    trades.push({ type: 'sell', price: currentPrice, quantity: stockQuantity, time: new Date() });
    // logger.info(`Sold ${stockQuantity} stocks at ${currentPrice}`);
    console.log(`Sold ${stockQuantity} stocks at ${currentPrice}`);
    stockQuantity = 0;
  }

  lastPrice = currentPrice;
}

// Moving Average Crossover strategy
async function evaluateMovingAverageCrossoverStrategy() {
  if (!botActive) return;

  const currentPrice = await fetchStockPrice();
  prices.push(currentPrice);  // Adding current price to prices array

  // Keeping only the last MOVING_AVERAGE_PERIOD prices
  if (prices.length > MOVING_AVERAGE_PERIOD) {
    prices.shift();  // Removing the oldest price
  }

  // Calculating the moving average
  const movingAverage = prices.reduce((acc, price) => acc + price, 0) / prices.length;

  // Trading logic based on moving average
  if (currentPrice > movingAverage && balance >= currentPrice) {
    // Buy
    const quantity = Math.floor(balance / currentPrice);
    stockQuantity += quantity;
    balance -= quantity * currentPrice;
    trades.push({ type: 'buy', price: currentPrice, quantity, time: new Date() });
    // logger.info(`Bought ${quantity} stocks at ${currentPrice}`);
    console.log(`Bought ${quantity} stocks at ${currentPrice}`);
  } else if (currentPrice < movingAverage && stockQuantity > 0) {
    // Sell
    balance += stockQuantity * currentPrice;
    profitLoss += (currentPrice - lastPrice) * stockQuantity;
    trades.push({ type: 'sell', price: currentPrice, quantity: stockQuantity, time: new Date() });
    // logger.info(`Sold ${stockQuantity} stocks at ${currentPrice}`);
    console.log(`Sold ${stockQuantity} stocks at ${currentPrice}`);
    stockQuantity = 0;
  }

  lastPrice = currentPrice;  // Updating lastPrice to currentPrice
}

// Momentum strategy: buy if price increases by 5% in 3 periods, sell if it decreases by 3% in 2 periods
async function evaluateMomentumStrategy() {
  if (!botActive) return;

  const currentPrice = await fetchStockPrice();

  if (!lastPrice) {
    lastPrice = currentPrice;  // Set initial price
    return;
  }

  prices.push(currentPrice);
  if (prices.length > 3) prices.shift();  // Keep the last 3 prices

  if (prices.length === 3) {
    const priceChange = ((currentPrice - prices[0]) / prices[0]) * 100;

    if (priceChange >= 5 && balance >= currentPrice) {
      const quantity = Math.floor(balance / currentPrice);
      stockQuantity += quantity;
      balance -= quantity * currentPrice;
      trades.push({ type: 'buy', price: currentPrice, quantity, time: new Date() });
      console.log(`Bought ${quantity} stocks at ${currentPrice} (Momentum)`);
    } else if (priceChange <= -3 && stockQuantity > 0) {
      balance += stockQuantity * currentPrice;
      profitLoss += (currentPrice - lastPrice) * stockQuantity;
      trades.push({ type: 'sell', price: currentPrice, quantity: stockQuantity, time: new Date() });
      console.log(`Sold ${stockQuantity} stocks at ${currentPrice} (Momentum)`);
      stockQuantity = 0;
    }
  }

  lastPrice = currentPrice;
}

// Evaluating strategy based on selected strategy
async function evaluateStrategy() {
  if (selectedStrategy === 'simple') {
    await evaluateSimpleStrategy();
  } else if (selectedStrategy === 'crossover') {
    await evaluateMovingAverageCrossoverStrategy();
  } else if (selectedStrategy === 'momentum') {
    await evaluateMomentumStrategy();
  }
}

// Function to start the bot
function startBot(strategy) {
  if (intervalId) {
    console.log('Bot is already running!');  // Bot is already running
    return;
  }
  botActive = true;

  // Storing the selected strategy
  if (strategy === 'simple') {
    selectedStrategy = 'simple'
    console.log('Starting the bot with Simple Strategy.');
  } else if (strategy === 'crossover') {
    selectedStrategy = 'crossover'
    console.log('Starting the bot with Moving Average Crossover Strategy.');
  } else if (strategy === 'momentum') {
    selectedStrategy = 'momentum'
    console.log('Starting the bot with Momentum Strategy.');
  }else {
    console.log('Invalid strategy selected.');
    return;
  }

  intervalId = setInterval(() => {
    evaluateStrategy().catch(console.error);
  }, 5000);  // Checking every 5 seconds
  console.log('Bot started!');
}

// Function to stop the bot
function stopBot() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    botActive = false;
    console.log('Bot stopped!');
  }
}

// Generating summary report 
function getSummaryReport() {
  console.log("\nSummary Report:");
  console.log("-----------------------------");
  trades.forEach(trade => {
    console.log(`${trade.time.toISOString()} - ${trade.type.toUpperCase()}: ${trade.quantity} stocks at $${trade.price}`);
  });
  console.log("-----------------------------");
  console.log(`Final Balance: $${balance.toFixed(2)}`);
  console.log(`Total Profit/Loss: $${profitLoss.toFixed(2)}`);
  console.log(`Stocks Held: ${stockQuantity}`);
  console.log("\n");
}

module.exports = { startBot, stopBot, getSummaryReport };