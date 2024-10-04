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

const MOCK_API_URL = process.env.MOCK_API_URL || "https://api.mock.com/stock";

// Mock function to simulate fetching stock price
async function fetchStockPrice() {
  const response = await axios.get(MOCK_API_URL);
  return response.data.price;
}

// Simple strategy: buy when price drops by 2%, sell when it rises by 3%
async function evaluateStrategy() {
  if (!botActive) return;

  const currentPrice = await fetchStockPrice();

  if (!lastPrice) {
    lastPrice = currentPrice;  // Set initial price
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
  } else if (priceChange >= 3 && stockQuantity > 0) {
    // Sell
    balance += stockQuantity * currentPrice;
    profitLoss += (currentPrice - lastPrice) * stockQuantity;
    trades.push({ type: 'sell', price: currentPrice, quantity: stockQuantity, time: new Date() });
    // logger.info(`Sold ${stockQuantity} stocks at ${currentPrice}`);
    stockQuantity = 0;
  }

  lastPrice = currentPrice;
}

// Function to start the bot
function startBot() {
  if (intervalId) return;  // Prevent multiple intervals
  botActive = true;
  intervalId = setInterval(() => {
    evaluateStrategy().catch(console.error);
  }, 10000);  // Check every 10 seconds
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
