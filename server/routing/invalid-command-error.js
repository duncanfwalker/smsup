function InvalidCommandError(message) {
  this.message = message;
}

InvalidCommandError.prototype = new Error();

export default InvalidCommandError;