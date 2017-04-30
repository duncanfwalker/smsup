const listeners = {};

function findListeners(commandName) {
  const commandListeners = listeners[commandName];
  return commandListeners !== undefined ? commandListeners : [];
}

function on(commandName, action) {
  const existing = findListeners(commandName);
  listeners[commandName] = [...existing, action];
}

function runListeners(command, event) {
  findListeners(command).forEach(listener => listener(event));
}

function reset() {
  listeners.length = 0;
}

module.exports = { on, reset, runListeners };
