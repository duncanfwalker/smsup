function DistributionError(groupName) {
  this.name = 'DistributionError';
  this.message = 'Could not distribute';
  this.groupName = groupName;
}

DistributionError.prototype = new Error();

module.exports = DistributionError;
