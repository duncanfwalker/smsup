function InvalidCommandError(message) {
  this.message = message;
  this.stack = (new Error()).stack;
  this.name = 'InvalidCommandError';
}

InvalidCommandError.prototype = Object.create(Error.prototype);
InvalidCommandError.prototype.constructor = InvalidCommandError;

module.exports = InvalidCommandError;