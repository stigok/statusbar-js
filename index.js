'use strict';

const exec = require('./exec-promise');

// Update interval (ms)
const updateInterval = process.argv[2] || 3000;

const commands = require('./commands.js');

// Run the status update worker
(function worker() {
  // Map all commands into exec promises
  const promises = commands.map(item => {
    return exec(item.cmd).then(stdout => {
      return item.actions.map(fn => fn(stdout));
    });
  });

  // Wait for all commands to finish then print results
  Promise.all(promises).then(results => {
    // Clear the console
    process.stdout.write('\x1B[2J\x1B[0f');
    console.log(results.join(' | '));

    // Start the worker again after a while
    setTimeout(worker, updateInterval);
  });
})();
