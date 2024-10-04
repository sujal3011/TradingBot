// src/index.js
const readline = require('readline');
const { startBot, stopBot, getSummaryReport } = require('./tradingBot');

// Create an interface for reading input from the terminal
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'BOT> '
});

console.log('Welcome to the Trading Bot CLI.');
console.log(`
    Welcome to the Trading Bot CLI.
    
    Available commands:
      - start  : Starts the trading bot. The bot will begin monitoring stock prices and executing trades based on predefined strategies.
      - stop   : Stops the trading bot. The bot will stop monitoring stock prices and will no longer execute any trades.
      - report : Displays a summary report of all trades made so far, including the profit/loss statement.
      - exit   : Exits the trading bot CLI.
    
    Please type one of the above commands and press Enter to proceed.
    `);
    
// Display the prompt
rl.prompt();

// Handle user input
rl.on('line', (input) => {
  const command = input.trim().toLowerCase();

  switch (command) {
    case 'start':
      startBot();
      break;
    case 'stop':
      stopBot();
      break;
    case 'report':
      getSummaryReport();
      break;
    case 'exit':
      rl.close();
      break;
    default:
      console.log('Unknown command. Available commands: start, stop, report, exit');
  }

  // Display the prompt again after handling input
  rl.prompt();
});

// Handle exit
rl.on('close', () => {
  console.log('Exiting the trading bot CLI. Goodbye!');
  process.exit(0);
});
