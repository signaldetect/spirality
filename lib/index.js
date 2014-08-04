/**
 * spirality
 * MIT Licensed
 */

var acter = require('./acter.js');

exports.acter = actualizer;

/**
 * Arguments:
 * (mod: hash) -> function
 */
function actualizer(mod) {
  return _acter;

  function _acter(initer) {
    return acter(mod, initer);
  }
}
