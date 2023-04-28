const express = require('express');
const cluster = require('cluster');
const os = require('os');

const app = express();

// Extreme worst case blocking situations
function delay(duration) {
  const startTime = Date.now();
  while (Date.now() - startTime < duration) {
    // event loop is blocked
  }
}

app.get('/', (req, res) => {
  // Following function or built in apis blocked Event loop
  // JSON.stringify({}) => ""
  // JSON.parse({})
  // [1,2,3,4,5].sort()
  // crypto.pbkdf2

  res.send(`Performance example ${process.pid}`);
});

app.get('/timer', (req, res) => {
  delay(9000);
  res.send(`Hello hello ${process.pid}`);
});

console.log('Running server.js...');
if (cluster.isMaster) {
  console.log('Master has been started...');
  const NUM_WORKERS = os.cpus().length;
  for (let i = 0; i < NUM_WORKERS; i++) {
    cluster.fork();
  }
} else {
  console.log('Worker process started...');
  app.listen(3000);
}
