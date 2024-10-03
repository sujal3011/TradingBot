const axios = require('axios');

let balance = 10000;  // Starting balance
let stockQuantity = 0;
let lastPrice = null;
let trades = [];
let profitLoss = 0;


const MOCK_API_URL = process.env.MOCK_API_URL; 

// Mock function to simulate fetching stock price
async function fetchStockPrice() {
  // This would be a real API call in a live environment
  const response = await axios.get(MOCK_API_URL);
//   console.log(response);
  console.log(response.data.price);
  return response.data.price;
}

// Simple strategy: buy when price drops by 2%, sell when it rises by 3%
async function evaluateStrategy() {
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
    trades.push({ type: 'buy', price: currentPrice, quantity });
    console.log(`Bought ${quantity} stocks at ${currentPrice}`);
  } else if (priceChange >= 3 && stockQuantity > 0) {
    // Sell
    balance += stockQuantity * currentPrice;
    profitLoss += (currentPrice - lastPrice) * stockQuantity;
    trades.push({ type: 'sell', price: currentPrice, quantity: stockQuantity });
    console.log(`Sold ${stockQuantity} stocks at ${currentPrice}`);
    stockQuantity = 0;
  }

  lastPrice = currentPrice;
}

function start() {
  setInterval(() => {
    evaluateStrategy().catch(console.error);
  }, 10000);  // Checking every 10 seconds
}

module.exports = { start };
