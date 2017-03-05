
const autoReplies = {
  join: (viewModel, { __ }) => __('You have joined the {{groupName}} group. The terms of use are ....', viewModel),
  leave: (viewModel, { __ }) => __('You have left the {{groupName}} group.', viewModel),
  create: (viewModel, { __ }) => __('\'{{groupName}}\' group created. ', viewModel),
  delete: (viewModel, { __ }) => __('the {{groupName}} group has been deleted.', viewModel),
};

module.exports = autoReplies;
