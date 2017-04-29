function GroupNotFoundError(groupName) {
  this.name = 'GroupNotFoundError';
  this.message = 'Group not found';
  this.groupName = groupName;
}

GroupNotFoundError.prototype = new Error();

module.exports = GroupNotFoundError;
