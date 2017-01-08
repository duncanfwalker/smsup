function DistributionError(message, tag) {
  this.message = message;
  this.tag = tag;
}

DistributionError.prototype = new Error();

module.exports = DistributionError;
