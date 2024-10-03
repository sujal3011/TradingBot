# Stock Trading Bot

This Node.js application simulates a basic trading bot for a hypothetical stock market. The bot monitors stock price changes from a mock API and executes trades based on predefined rules. It tracks profit/loss and performance metrics over time.

## Features

- Monitors stock prices from a mock API endpoint.
- Implements a simple trading strategy:
  - **Buy** when the stock price drops by 2%.
  - **Sell** when the stock price rises by 3%.
- Tracks the bot's balance, stock holdings, and overall profit/loss.
- Logs all trades (buy/sell) with relevant details.
- Uses environment variables to configure the API endpoint.

## Tech Stack

- **Node.js** - Backend development.
- **Axios** - HTTP requests to fetch stock prices.
- **Dotenv** - Environment variables for configuration.
- **Nodemon** - Auto-restart during development.

## Requirements

- Node.js (v12 or higher)
- npm or yarn
- Mock API endpoint to simulate stock prices

## Setup and Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/stock-trading-bot.git
cd stock-trading-bot
