
const autoReplies = {
  join: (viewModel, { __ }) => {
    return [
      __('You have joined the {{groupName}} group.', viewModel),
      __('SMS Up terms of use are.', viewModel),
    ].join(' ');
  },
  leave: (viewModel, { __ }) => __('You have left the {{groupName}} group.', viewModel),
  create: (viewModel, { __ }) => __('\'{{groupName}}\' group created. ', viewModel),
  delete: (viewModel, { __ }) => __('the {{groupName}} group has been deleted.', viewModel),
  invitation: (viewModel, { __ }) => {
    return [
      __('You have been invited to the \'{{groupName}}\' group.', viewModel),
      __('SMS Up terms of use are.', viewModel),
      __('Reply "{{prefix}}join {{groupName}}" to join.', viewModel),
    ].join(' ');
  },
};

module.exports = autoReplies;
