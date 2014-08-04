var acter = require('spirality').acter(module);

var http = require('http');

/**
 * App
 * Definition
 */

acter(App)
  .effects(viewLoadFailed)
  .events(launched, terminated, 'routing');

/**
 * App
 * Implementation
 */

/**
 * Initialization
 */
function App() {
  this.launched();
  // Runs the server
  var $this = this;
  http.createServer(_listener).listen(8080);

  function _listener(req, res) {
    var msec = Date.now(); // milliseconds (Unix time)
    var nsec = process.hrtime()[1]; // nanoseconds
    $this.routing(/*key=*/msec + '_' + nsec, req, res);
  }
}

/**
 * Effect of the event "loadingFailed" from View
 */
function viewLoadFailed(error) {
  this.terminated();
  throw new Error('Template loading error: ' + error);
}

/**
 * Events
 */

function launched() {
  console.log('Server is running at [http://localhost:8080/]...');
}

function terminated() {
  console.log('Server is terminated.');
}

// Event routing
//   arguments: key, req, res
