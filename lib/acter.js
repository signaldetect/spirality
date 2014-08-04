/**
 * acter.js is a part of spirality
 * MIT Licensed
 */

var wrapper = require('./wrapper.js');
var effector = require('./effector.js');
var signals = require('./signals.js');
var signal = signals.signal;

module.exports = acter;

// Reference to a prototype of a selected actualizer
var proto = null; // type: hash

// Definitors
var defs = {
  /* TODO: Add following definitors
  base: defBase,
  states: defStates,
  */
  effects: defEffects,
  events: defEvents
};

/**
 * Arguments:
 * (mod: hash, initer: function) -> hash
 */
function acter(mod, initer) {
  // Creates the actualizer
  var act = wrapper(/*intro=*/record, /*ctor=*/initer); // type: function
  // Setups the module of the actualizer
  mod.exports = act;
  // Selects and initializes the prototype
  proto = act.prototype;
  proto._slots_ = [];
  // Returns definitors
  return defs;
}

/**
 * Initializer of slots
 *
 * Arguments:
 * () -> undefined
 */
function record() {
  var slots = this._slots_; // type: Array
  var n = slots.length; // type: number
  // Records the instance for effectors
  for (var i = 0; i < n; i++)
    slots[i].push(this);
}

/**
 * Definitor of effects
 *
 * Arguments:
 * (arguments: functions) -> hash
 */
function defEffects() {
  var effect; // type: function
  var n = arguments.length; // type: number
  //
  for (var i = 0; i < n; i++) {
    effect = arguments[i];
    //
    if (typeof effect !== 'function')
      fail('All effects must be functions.');
    //
    signal(effect.name)
      .datum('nargs', /*updater=*/defNumArgs, /*value=*/effect.length)
      .datum('etor', /*updater=*/defEffector)
      .assoc(effect, /*binder=*/defEffect);
  }
  // Returns definitors
  return this;
}

/**
 * Definitor of events
 *
 * Arguments:
 * (arguments: functions|strings) -> hash
 */
function defEvents() {
  var event; // type: function or string
  var id = uncapitalize(proto.constructor.name); // type: string
  var n = arguments.length; // type: number
  //
  for (var i = 0; i < n; i++) {
    event = arguments[i];
    //
    if (typeof event === 'function') {
      // Adds combination of the self-effect (event) invoker and the effector
      signal(/*name=*/id + capitalize(event.name))
        .datum('nargs', /*updater=*/defNumArgs, /*value=*/event.length)
        .assoc(event, /*binder=*/defEvent);
    }
    else if (typeof event === 'string') {
      // Adds only the effector
      signal(/*name=*/id + capitalize(event))
        .datum('etor', /*updater=*/defEffector, /*value=*/[proto, event]);
    }
    else
      fail('Events must be functions or strings.');
  }
  // Returns definitors
  return this;
}

/**
 * Updater of signal datum "nargs"
 *
 * Arguments:
 * (data: hash, nargs: number) -> undefined
 */
function defNumArgs(data, nargs) {
  // Checks number of arguments
  if (nargs !== data.nargs) {
    fail('Number of arguments of the effect "' + signals.selected() +
         '" should be equal to ' + data.nargs + '.');
  }
  // Otherwise => numbers are equal
  // Returns undefined => datum "nargs" doesn't change
}

/**
 * Updater of signal datum "etor"
 *
 * Arguments:
 * (data: hash, etor: Array|undefined) -> null|undefined
 */
function defEffector(data, etor) {
  var host = data.etor[0]; // host prototype, type: hash
  var name = data.etor[1]; // event name, type: string
  //
  if ('nargs' in data) {
    // Defines the effector
    host[name] = effector.outer(/*id=*/'_effect_' + data.idx + '_',
                                data.hdls, data.nargs);
    // Removes datum "etor"
    return null;
  }
  // Otherwise => number of arguments is unknown
  host[name] = dummy; // temporary
  // Returns undefined => datum "etor" doesn't change
}

/**
 * Signal-effect binder
 *
 * Arguments:
 * (data: hash, effect: function) -> undefined
 */
function defEffect(data, effect) {
  proto['_effect_' + data.idx + '_'] = effect;
  proto._slots_.push(data.hdls);
}

/**
 * Signal-event binder
 *
 * Arguments:
 * (data: hash, event: function) -> undefined
 */
function defEvent(data, event) {
  var id = '_event_' + data.idx + '_'; // event ID, type: string
  //
  proto[id] = event;
  proto[event.name] = effector.bidir(/*in_id=*/id,
                                     /*out_id=*/'_effect_' + data.idx + '_',
                                     data.hdls, data.nargs);
}

/**
 * Arguments:
 * (error_msg: string) -> undefined
 */
function fail(error_msg) {
  throw new Error('Error in actualizer "' + proto.constructor.name +
                  '" definition: ' + error_msg);
}

/**
 * Arguments:
 * () -> undefined
 */
function dummy() {
}

/**
 * Arguments:
 * (name: string) -> string
 */
function capitalize(name) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

/**
 * Arguments:
 * (name: string) -> string
 */
function uncapitalize(name) {
  return name.charAt(0).toLowerCase() + name.slice(1);
}
