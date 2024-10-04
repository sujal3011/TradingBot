# Trading Bot

A simple trading bot that employs various trading strategies to simulate stock trading. This bot fetches stock prices from a mock API, evaluates trading strategies, and logs transactions. The application includes a web interface to start and stop the bot and generate a summary report of trades.

## Table of Contents

- [Features](#features)
- [Trading Logic](#trading-logic)
- [API Usage](#api-usage)
- [Setup and Installation](#setup-and-installation)
- [Script Commands](#script-commands)
- [CLI Interface](#cli-interface)
- [Web Interface](#web-interface)

## Features

- Multiple trading strategies:
  - Simple Strategy: Buys when the price drops by 2% and sells when it rises by 3%.
  - Moving Average Crossover Strategy: Buys when the price is above the moving average and sells when it is below.
  - Momentum Strategy: Buys if the price increases by 5% in 3 periods and sells if it decreases by 3% in 2 periods.
- Mock API for simulating stock prices.
- Web interface for controlling the bot and generating reports.
- Comprehensive logging for tracking trades and bot activity.

## Trading Logic

The bot implements the following trading strategies:

1. **Simple Strategy**:
   - Buy: When the price drops by 2% from the last price.
   - Sell: When the price rises by 3% from the last price.

2. **Moving Average Crossover Strategy**:
   - Buy: When the current price is above the moving average.
   - Sell: When the current price is below the moving average.

3. **Momentum Strategy**:
   - Buy: When the price increases by 5% over 3 periods.
   - Sell: When the price decreases by 3% over 2 periods.

The bot fetches stock prices from a mock API and logs every trade made.

## API Usage

### Mock API

The application includes a mock API that simulates stock prices. It can be run on a separate port (default: 5000). 

- **Endpoint**: `/price`
- **Response**: Returns a random stock price between 100 and 500.
  
Example Response:
```json
{
  "price": 238
}


## Setup and Installation

Follow the steps below to set up and run the trading bot project on your local machine.

### Prerequisites

Ensure that you have the following installed on your system:

- **Node.js** (version 14.x or higher)
- **npm** (Node Package Manager)
- **Git** (optional, for version control)

### Installation Steps

1. **Clone the Repository**:
   First, clone the project repository from GitHub (or your source control) to your local machine:
   ```bash
   git clone https://github.com/sujal3011/TradingBot.git



2. **Install Dependencies**: 
   Install all required dependencies using npm : 
   ```bash
   npm install

3. **Set Up Environment Variables**: 
   Create a .env file in the root directory of the project and set the necessary environment variables : 

    PORT =
    MOCK_API_URL =


## Script Commands

The following npm scripts are available to run different parts of the application. Each script is designed for specific scenarios depending on which part of the application you want to run.

```json
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node src/app.js & node src/index.js & node src/mockApi.js",
    "dev:app": "nodemon src/app.js",
    "dev:cli": "nodemon src/index.js",
    "dev:mock": "nodemon src/mockApi.js",
    "dev:all": "nodemon --exec \"node src/app.js & node src/index.js & node src/mockApi.js\""
}



## Using CLI Interface
    Start using the CLI interface by running the following command :
    ```bash
    npm run dev:cli


## Using Web Interface
    Start the Express.js server by running the following command :
    ```bash
    npm run dev:app