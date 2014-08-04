var acter = require('spirality').acter(module);

var fs = require('fs');
var formidable = require('formidable');

/**
 * Image
 * Definition
 */

acter(Image)
  .effects(actionUploadRequested, actionShowRequested)
  .events('uploaded', 'loaded', 'unsupported', 'notFound', 'processFailed');

/**
 * Image
 * Implementation
 */

/**
 * Initialization
 */
function Image() {
  // Supported image subtypes -> extensions
  this.exts = {
    'gif': 'gif',
    'jpeg': 'jpg',
    'pjpeg': 'jpg', // IE non-standard subtype
    'png': 'png',
    'x-png': 'png', // IE non-standard subtype
    'svg+xml': 'svg'
  };
  // Supported image extensions -> subtypes
  this.subtps = swapKeyVal(this.exts);
}

/**
 * Effect of the event "uploadRequested" from Action
 */
function actionUploadRequested(key, params) {
  var form = new formidable.IncomingForm();
  var $this = this;
  form.parse(params, _ready);

  function _ready(error, fields, files) {
    if (error) // => some parsing error
      $this.processFailed(key, error);
    else
      upload($this, key, files.image);
  }
}

/**
 * Effect of the event "showRequested" from Action
 */
function actionShowRequested(key, params) {
  var ext = params.imgExt; // image file extension
  var name = params.imgId + '.' + ext;
  //
  var $this = this;
  fs.readFile('./public/' + name, _ready);
  
  function _ready(error, data) {
    if (error) {
      if (error.code === 'ENOENT') // => no such file
        $this.notFound(key, name);
      else // => unknown error
        $this.processFailed(key, error);
    }
    else
      $this.loaded(key, /*type=*/'image/' + $this.subtps[ext], data);
  }
}

/**
 * Events
 */

// Event uploaded
//   arguments: key, name

// Event loaded
//   arguments: key, type, data

// Event unsupported
//   arguments: key

// Event notFound
//   arguments: key, name

// Event processFailed
//   arguments: key, error

/**
 * Helpers
 */

/**
 * Swaps hash keys and values
 */
function swapKeyVal(hash) {
  var res = {};
  var val;
  //
  for (var key in hash) {
    val = hash[key];
    if (!(val in res))
      res[val] = key;
  }
  //
  return res;
}

/**
 * Uploads the image file
 */
function upload($this, key, image) {
  var exts = $this.exts;
  var subtp = image.type.replace('image/', '');
  var name, from, into;
  //
  if (subtp in exts) {
    name = key + '.' + exts[subtp];
    from = image.path;
    into = './public/' + name;
    fs.rename(from, into, _rmOnFail);
  }
  else
    $this.unsupported(key);

  function _rmOnFail(error) {
    if (error) {
      // Possible error in Windows
      // Removes the old file
      fs.unlink(into);
      // Tries to move the file again
      fs.rename(from, into, _ready);
    }
    else
      _ready();
  }

  function _ready(error) {
    if (error) // => unknown error
      $this.processFailed(key, error);
    else
      $this.uploaded(key, name);
  }
}
