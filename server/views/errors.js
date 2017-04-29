const errorMessages = {
  GroupNotFoundError: (error, { __ }) => __("Sorry but the '{{groupName}}' group doesn't exist", error),
  DistributionError: (error, { __ }) => __("Sorry, you send a message to '{{groupName}}' but no group with name exists. Start your message with name of a group", error),
};

const unknownError = (error, { __ }) => __("That didn't work, try again", error);

module.exports = { errorMessages, unknownError };