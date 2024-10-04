const readline = require('readline');
const { startBot, stopBot, getSummaryReport } = require('./tradingBot');

let selectedStrategy = null;  // Variable to store the selected strategy

// Creating an interface for reading input from the terminal
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'BOT> '
});

console.log('Welcome to the Trading Bot CLI.');
console.log(`
    Welcome to the Trading Bot CLI.
    
    Available commands:
      - strategy: Choose a trading strategy before starting the bot.
      - start   : Starts the trading bot using the selected strategy.
      - stop    : Stops the trading bot. The bot will stop monitoring stock prices and will no longer execute any trades.
      - report   : Displays a summary report of all trades made so far, including the profit/loss statement.
      - exit    : Exits the trading bot CLI.
    
    Please type one of the above commands and press Enter to proceed.
    `);
    

rl.prompt();


rl.on('line', (input) => {
  const command = input.trim().toLowerCase();

  switch (command) {
    case 'strategy':
      console.log('Select a trading strategy:');
      console.log('1. Simple Strategy (Buy when price drops by 2%, Sell when it rises by 3%)');
      console.log('2. Moving Average Crossover Strategy');
      console.log('3. Momentum Strategy (Buy when price drops by 2%, Sell when it rises by 3%)');
      rl.question('Enter the number of the strategy you want to use (1, 2, or 3): ', (answer) => {
        if (answer === '1') {
          selectedStrategy = 'simple';
          console.log('You have selected the Simple Strategy.');
        } else if (answer === '2') {
          selectedStrategy = 'crossover';
          console.log('You have selected the Moving Average Crossover Strategy.');
        } else if (answer === '3') {
          selectedStrategy = 'momentum';
          console.log('You have selected the Momentum Strategy.');
        } else {
          console.log('Invalid selection. Please choose 1, 2, or 3.');
        }
        rl.prompt();
      });
      break;

    case 'start':
      if (!selectedStrategy) {
        console.log('Please select a strategy before starting the bot. Use the "strategy" command.');
      } else {
        startBot(selectedStrategy);
      }
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
      console.log('Unknown command. Available commands: strategy, start, stop, report, exit');
  }

  if (command !== 'strategy') {
    rl.prompt();
  }
});

rl.on('close', () => {
  console.log('Exiting the trading bot CLI. Goodbye!');
  process.exit(0);
});
