const autoReplies = {
  join: ({ groupName }) => {
    return `You have joined the ${groupName} group. The terms of use are ....`
  },
  leave: ({ groupName }) => {
    return `You have left the ${groupName} group.`
  }
};

function autoReply(view, result) {
  const autoReply = autoReplies[view];
  if(autoReply) return autoReply(result);
}

module.exports = autoReply;