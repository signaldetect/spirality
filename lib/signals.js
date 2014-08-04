/**
 * signals.js is a part of spirality
 * MIT Licensed
 */

module.exports = {
  // Accessor
  signal: signal,

  // Informers
  selected: selected,
  count: count
  // TODO: Add more informers for monitoring
};

// All signals
var signals = {}; // type: hash

// Reference to a selected signal
var sgnl = null; // type: hash

// Definitors
var defs = {
  datum: defDatum,
  assoc: defAssoc
};

/**
 * Accessor of a signal
 *
 * Arguments:
 * (name: string) -> hash
 */
function signal(name) {
  if (!(name in signals)) {
    // Adds the signal
    signals[name] = {
      idx: count(), // unique index, type: number
      hdls: [] // handlers of an effect, type: Array
    };
  }
  // Selects the signal
  sgnl = signals[name];
  // Returns definitors
  return defs;
}

/**
 * Definitor of datum of a signal
 *
 * Arguments:
 * (key: string, updater: function, value: any) -> hash
 */
function defDatum(key, updater, value) {
  if (key in sgnl) {
    // Updates the value
    value = updater(/*data=*/sgnl, value);
  }
  else if (value !== undefined) {
    // Adds new datum
    sgnl[key] = value;
    // Updates the value
    value = updater(/*data=*/sgnl, value);
  }
  // Checks the updated value
  switch (value) {
  case undefined:
    // Do nothing
    break;
  case null:
    // Removes datum
    delete sgnl[key];
    break;
  default:
    // Updates datum
    sgnl[key] = value;
  }
  // Returns definitors
  return this;
}

/**
 * Definitor of association of a signal
 *
 * Arguments:
 * (entity: function, binder: function) -> hash
 */
function defAssoc(entity, binder) {
  binder(/*data=*/sgnl, entity);
  // Returns definitors
  return this;
}

/**
 * Name of a selected signal
 *
 * Arguments:
 * () -> string
 */
function selected() {
  for (var name in signals) {
    if (signals[name] === sgnl)
      return name;
  }
}

/**
 * Number of signals
 *
 * Arguments:
 * () -> number
 */
function count() {
  return Object.keys(signals).length;
}
