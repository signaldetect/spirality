/**
 * effector.js is a part of spirality
 * MIT Licensed
 */

module.exports = {
  outer: outer,
  bidir: bidir
};

/**
 * Outer signal emitter
 *
 * Arguments:
 * (id: string, hdls: Array, nargs: number) -> function
 */
function outer(id, hdls, nargs) {
  switch (nargs) { // number of arguments
  // Fast cases
  case 0:
    return _args0;
  case 1:
    return _args1;
  case 2:
    return _args2;
  case 3:
    return _args3;
  case 4:
    return _args4;
  case 5:
    return _args5;
  // Slower
  default:
    return _argsN;
  }

  function _args0() {
    var n = hdls.length;
    for (var i = 0; i < n; i++)
      hdls[i][id]();
  }

  function _args1(arg) {
    var n = hdls.length;
    for (var i = 0; i < n; i++)
      hdls[i][id](arg);
  }

  function _args2(arg1, arg2) {
    var n = hdls.length;
    for (var i = 0; i < n; i++)
      hdls[i][id](arg1, arg2);
  }

  function _args3(arg1, arg2, arg3) {
    var n = hdls.length;
    for (var i = 0; i < n; i++)
      hdls[i][id](arg1, arg2, arg3);
  }

  function _args4(arg1, arg2, arg3, arg4) {
    var n = hdls.length;
    for (var i = 0; i < n; i++)
      hdls[i][id](arg1, arg2, arg3, arg4);
  }

  function _args5(arg1, arg2, arg3, arg4, arg5) {
    var n = hdls.length;
    for (var i = 0; i < n; i++)
      hdls[i][id](arg1, arg2, arg3, arg4, arg5);
  }

  function _argsN() {
    var hdl, n = hdls.length;
    for (var i = 0; i < n; i++) {
      hdl = hdls[i];
      hdl[id].apply(hdl, arguments);
    }
  }
}

/**
 * Bidirectional signal emitter
 *
 * Arguments:
 * (in_id: string, out_id: string, hdls: Array, nargs: number) -> function
 */
function bidir(in_id, out_id, hdls, nargs) {
  switch (nargs) { // number of arguments
  // Fast cases
  case 0:
    return _args0;
  case 1:
    return _args1;
  case 2:
    return _args2;
  case 3:
    return _args3;
  case 4:
    return _args4;
  case 5:
    return _args5;
  // Slower
  default:
    return _argsN;
  }

  function _args0() {
    this[in_id]();
    //
    var n = hdls.length;
    for (var i = 0; i < n; i++)
      hdls[i][out_id]();
  }

  function _args1(arg) {
    this[in_id](arg);
    //
    var n = hdls.length;
    for (var i = 0; i < n; i++)
      hdls[i][out_id](arg);
  }

  function _args2(arg1, arg2) {
    this[in_id](arg1, arg2);
    //
    var n = hdls.length;
    for (var i = 0; i < n; i++)
      hdls[i][out_id](arg1, arg2);
  }

  function _args3(arg1, arg2, arg3) {
    this[in_id](arg1, arg2, arg3);
    //
    var n = hdls.length;
    for (var i = 0; i < n; i++)
      hdls[i][out_id](arg1, arg2, arg3);
  }

  function _args4(arg1, arg2, arg3, arg4) {
    this[in_id](arg1, arg2, arg3, arg4);
    //
    var n = hdls.length;
    for (var i = 0; i < n; i++)
      hdls[i][out_id](arg1, arg2, arg3, arg4);
  }

  function _args5(arg1, arg2, arg3, arg4, arg5) {
    this[in_id](arg1, arg2, arg3, arg4, arg5);
    //
    var n = hdls.length;
    for (var i = 0; i < n; i++)
      hdls[i][out_id](arg1, arg2, arg3, arg4, arg5);
  }

  function _argsN() {
    this[in_id].apply(this, arguments);
    //
    var hdl, n = hdls.length;
    for (var i = 0; i < n; i++) {
      hdl = hdls[i];
      hdl[out_id].apply(hdl, arguments);
    }
  }
}
