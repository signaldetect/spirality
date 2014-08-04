var acter = require('spirality').acter(module);

var url = require('url');

/**
 * Action
 * Definition
 */

acter(Action)
  .effects(appRouting)
  .events(formRequested, uploadRequested, showRequested, notFound);

/**
 * Action
 * Implementation
 */

/**
 * Initialization
 */
function Action() {
  this.actions = {
    '/': 'formRequested',
    '/form': 'formRequested',
    '/upload': 'uploadRequested',
    '/show': 'showRequested'
  };
  this.pattern = /^(\/\w{0,20})(?:\/(\d{1,16}_\d{1,9})\.(\w{3,4}))?\/?$/;
}

/**
 * Effect of the event "routing" from App
 */
function appRouting(key, req, res) {
  // Processes the request
  var pathname = url.parse(req.url).pathname;
  var q = pathname.match(this.pattern) || []; // => [URL, route, id, ext]
  var route = q[1], id = q[2], ext = q[3];
  // Routes the request
  var actions = this.actions;
  if (route in actions) {
    if (id && ext) {
      // Adds the image ID and extension to the request parameters
      req.imgId = id;
      req.imgExt = ext;
    }
    this[actions[route]](key, /*params=*/req);
  }
  else
    this.notFound(key, pathname);
}

/**
 * Events
 */

function formRequested(key, params) {
  console.log('Request for [/form] received.');
}

function uploadRequested(key, params) {
  console.log('Request for [/upload] received.');
}

function showRequested(key, params) {
  console.log('Request for [/show] received.');
}

function notFound(key, pathname) {
  console.log('No action found for [' + pathname + '].');
}
