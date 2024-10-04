const axios = require('axios');
const logger = require('./logger');
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
  try {
    const response = await axios.get(MOCK_API_URL);
    return response.data.price;
  } catch (error) {
    logger.error(`Error fetching stock price: ${error.message}`);
    throw new Error('Could not fetch stock price.');
  }
}

// Simple strategy: buying when price drops by 2%, selling when it rises by 3%
async function evaluateSimpleStrategy() {
  if (!botActive) return;

  try {
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
      logger.info(`Bought ${quantity} stocks at ${currentPrice}`);
    } else if (priceChange >= 3 && stockQuantity > 0) {
      // Sell
      balance += stockQuantity * currentPrice;
      profitLoss += (currentPrice - lastPrice) * stockQuantity;
      trades.push({ type: 'sell', price: currentPrice, quantity: stockQuantity, time: new Date() });
      logger.info(`Sold ${stockQuantity} stocks at ${currentPrice}`);
      stockQuantity = 0;
    }

    lastPrice = currentPrice;
  } catch (error) {
    logger.error(`Error in Simple Strategy: ${error.message}`);
  }
}

// Moving Average Crossover strategy
async function evaluateMovingAverageCrossoverStrategy() {
  if (!botActive) return;

  try {
    const currentPrice = await fetchStockPrice();
    prices.push(currentPrice);
    if (prices.length > MOVING_AVERAGE_PERIOD) {
      prices.shift();
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
      logger.info(`Bought ${quantity} stocks at ${currentPrice}`);
    } else if (currentPrice < movingAverage && stockQuantity > 0) {
      // Sell
      balance += stockQuantity * currentPrice;
      profitLoss += (currentPrice - lastPrice) * stockQuantity;
      trades.push({ type: 'sell', price: currentPrice, quantity: stockQuantity, time: new Date() });
      logger.info(`Sold ${stockQuantity} stocks at ${currentPrice}`);
      stockQuantity = 0;
    }

    lastPrice = currentPrice;  // Updating lastPrice to currentPrice
  } catch (error) {
    logger.error(`Error in Moving Average Crossover Strategy: ${error.message}`);
  }
}

// Momentum strategy: buying if price increases by 5% in 3 periods, selling if it decreases by 3% in 2 periods
async function evaluateMomentumStrategy() {
  if (!botActive) return;

  try {
    const currentPrice = await fetchStockPrice();

    if (!lastPrice) {
      lastPrice = currentPrice;  // Set initial price
      return;
    }

    prices.push(currentPrice);
    if (prices.length > 3) prices.shift();

    if (prices.length === 3) {
      const priceChange = ((currentPrice - prices[0]) / prices[0]) * 100;

      if (priceChange >= 5 && balance >= currentPrice) {
        const quantity = Math.floor(balance / currentPrice);
        stockQuantity += quantity;
        balance -= quantity * currentPrice;
        trades.push({ type: 'buy', price: currentPrice, quantity, time: new Date() });
        logger.info(`Bought ${quantity} stocks at ${currentPrice} (Momentum)`);
      } else if (priceChange <= -3 && stockQuantity > 0) {
        balance += stockQuantity * currentPrice;
        profitLoss += (currentPrice - lastPrice) * stockQuantity;
        trades.push({ type: 'sell', price: currentPrice, quantity: stockQuantity, time: new Date() });
        logger.info(`Sold ${stockQuantity} stocks at ${currentPrice} (Momentum)`);
        stockQuantity = 0;
      }
    }

    lastPrice = currentPrice;
  } catch (error) {
    logger.error(`Error in Momentum Strategy: ${error.message}`);
  }
}

// Evaluating strategy based on selected strategy
async function evaluateStrategy() {
  try {
    if (selectedStrategy === 'simple') {
      await evaluateSimpleStrategy();
    } else if (selectedStrategy === 'crossover') {
      await evaluateMovingAverageCrossoverStrategy();
    } else if (selectedStrategy === 'momentum') {
      await evaluateMomentumStrategy();
    } else {
      logger.warn('No valid strategy selected.');
    }
  } catch (error) {
    logger.error(`Error evaluating strategy: ${error.message}`);
  }
}

// Function to start the bot
function startBot(strategy) {
  if (intervalId) {
    logger.warn('Bot is already running!');
    return;
  }
  botActive = true;

  // Storing the selected strategy
  if (strategy === 'simple') {
    selectedStrategy = 'simple';
    logger.info('Starting the bot with Simple Strategy.'); 
  } else if (strategy === 'crossover') {
    selectedStrategy = 'crossover';
    logger.info('Starting the bot with Moving Average Crossover Strategy.');
  } else if (strategy === 'momentum') {
    selectedStrategy = 'momentum';
    logger.info('Starting the bot with Momentum Strategy.');
  } else {
    logger.info('Invalid strategy selected.');
    return;
  }

  intervalId = setInterval(() => {
    evaluateStrategy().catch(error => logger.error(`Error in evaluateStrategy: ${error.message}`));
  }, 5000);  // Checking every 5 seconds
  logger.info('Bot started!'); 
}

// Function to stop the bot
function stopBot() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    botActive = false;
    logger.info('Bot stopped!');
  } else {
    logger.warn('Bot is not running!');
  }
}

// Generating summary report 
function getSummaryReport() {
  logger.info("Generating summary report..."); // Logging when generating the report
  
  // Logging each trade
  logger.info("Trades made:");
  trades.forEach(trade => {
    const tradeInfo = `${trade.time.toISOString()} - ${trade.type.toUpperCase()}: ${trade.quantity} stocks at $${trade.price}`;
    logger.info(tradeInfo);
    console.log(tradeInfo);
  });
  
  // Logging summary details
  const finalBalanceInfo = `Final Balance: $${balance.toFixed(2)}`;
  const profitLossInfo = `Total Profit/Loss: $${profitLoss.toFixed(2)}`;
  const stocksHeldInfo = `Stocks Held: ${stockQuantity}`;

  logger.info(finalBalanceInfo);
  logger.info(profitLossInfo);
  logger.info(stocksHeldInfo);

  // Printing summary details to console
  console.log("\nSummary Report:");
  console.log("-----------------------------");
  console.log(finalBalanceInfo);
  console.log(profitLossInfo);
  console.log(stocksHeldInfo);
  console.log("-----------------------------");
  console.log("\n");
}

module.exports = { startBot, stopBot, getSummaryReport };
