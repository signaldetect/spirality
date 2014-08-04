/**
 * wrapper.js is a part of spirality
 * MIT Licensed
 */

module.exports = wrapper;

/**
 * Arguments:
 * (intro: function, ctor: function) -> function
 */
function wrapper(intro, ctor) {
  var wrap; // wrapped constructor, type: function
  //
  switch (ctor.length) { // number of arguments
  // Fast cases
  case 0:
    wrap = _args0;
    break;
  case 1:
    wrap = _args1;
    break;
  case 2:
    wrap = _args2;
    break;
  case 3:
    wrap = _args3;
    break;
  case 4:
    wrap = _args4;
    break;
  case 5:
    wrap = _args5;
    break;
  // Slower
  default:
    wrap = _argsN;
  }
  //
  wrap.prototype._intro_ = intro;
  wrap.prototype.constructor = ctor;
  //
  return wrap;

  function _args0() {
    this._intro_();
    this.constructor();
  }

  function _args1(arg) {
    this._intro_();
    this.constructor(arg);
  }

  function _args2(arg1, arg2) {
    this._intro_();
    this.constructor(arg1, arg2);
  }

  function _args3(arg1, arg2, arg3) {
    this._intro_();
    this.constructor(arg1, arg2, arg3);
  }

  function _args4(arg1, arg2, arg3, arg4) {
    this._intro_();
    this.constructor(arg1, arg2, arg3, arg4);
  }

  function _args5(arg1, arg2, arg3, arg4, arg5) {
    this._intro_();
    this.constructor(arg1, arg2, arg3, arg4, arg5);
  }

  function _argsN() {
    this._intro_();
    this.constructor.apply(this, arguments);
  }
}
