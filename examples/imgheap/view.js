var acter = require('spirality').acter(module);

var fs = require('fs');
var jade = require('jade');

/**
 * View
 * Definition
 */

acter(View)
  .effects(appLaunched, appRouting,
           actionFormRequested, actionNotFound,
           imageUploaded, imageLoaded,
           imageUnsupported, imageNotFound, imageProcessFailed)
  .events('loadFailed');

/**
 * View
 * Implementation
 */

/**
 * Initialization
 */
function View() {
  // Jade templates
  this.form; // HTML form, type: function
}

/**
 * Effect of the event "launched" from App
 */
function appLaunched() {
  loadForm(this);
}

/**
 * Effect of the event "routing" from App
 */
function appRouting(key, req, res) {
  update(key, 'res', res);
}

/**
 * Effect of the event "formRequested" from Action
 */
function actionFormRequested(key, params) {
  update(key, 'msg', {status: 200, type: 'text/html',
                      body: this.form({title: 'Uploading Image'})});
}

/**
 * Effect of the event "notFound" from Action
 */
function actionNotFound(key, pathname) {
  update(key, 'msg', {status: 404, type: 'text/plain',
                      body: '404 No handler found for ' + pathname});
}

/**
 * Effect of the event "uploaded" from Image
 */
function imageUploaded(key, name) {
  update(key, 'msg', {status: 200, type: 'text/html',
                      body: 'You\'ve uploaded the image:<br />' +
                            '<img src="/show/' + name + '" />'});
}

/**
 * Effect of the event "loaded" from Image
 */
function imageLoaded(key, type, data) {
  update(key, 'msg', {status: 200, type: type, body: data});
}

/**
 * Effect of the event "failed" from Image
 */
function imageUnsupported(key) {
  update(key, 'msg', {status: 415, type: 'text/plain',
                      body: '415 We support the following image types: ' +
                            'GIF, JPEG, PNG and SVG'});
}

/**
 * Effect of the event "failed" from Image
 */
function imageNotFound(key, name) {
  update(key, 'msg', {status: 404, type: 'text/plain',
                      body: '404 Image file ' + name + ' not found'});
}

/**
 * Effect of the event "failed" from Image
 */
function imageProcessFailed(key, error) {
  update(key, 'msg', {status: 500, type: 'text/plain',
                      body: '500 Error processing the image: ' + error});
}

/**
 * Events
 */

// Event loadingFailed
//   arguments: error

/**
 * Helpers
 */

function loadForm($this) {
  fs.readFile('./templates/form.jade', {encoding: 'utf8'}, _ready);

  function _ready(error, file) {
    if (error)
      $this.loadingFailed(error);
    else
      $this.form = jade.compile(file);
  }
}

var channels = {};

function update(key, prop_name, prop_value) {
  if (!(key in channels))
    channels[key] = {};
  //
  var chnl = channels[key];
  chnl[prop_name] = prop_value;
  //
  if (('res' in chnl) && ('msg' in chnl)) {
    var res = chnl.res;
    var msg = chnl.msg;
    // Uses the response
    res.writeHead(msg.status, {'Content-Type': msg.type});
    res.write(msg.body);
    res.end();
    // Clears the channel
    delete channels[key];
  }
}
