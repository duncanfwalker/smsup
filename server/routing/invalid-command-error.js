function InvalidCommandError(message) {
  this.message = message;
}

InvalidCommandError.prototype = new Error();

module.exports = InvalidCommandError;