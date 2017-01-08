
const autoReplies = {
  join: (viewModel, { __ }) => __('You have joined the {{groupName}} group. The terms of use are ....', viewModel),
  leave: (viewModel, { __ }) => __('You have left the {{groupName}} group.', viewModel),
};

module.exports = autoReplies;
