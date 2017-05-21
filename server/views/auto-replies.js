const autoReplies = {
  join: (viewModel, { __, join }) => join([
    __('You have joined the {{groupName}} group.', viewModel),
    viewModel.includeTerms ? __('SMS Up terms of use are.', viewModel) : '',
  ]),
  leave: (viewModel, { __, join }) => join([
    __('You have left the {{groupName}} group.', viewModel),
    __('Reply "join {{groupName}}" to rejoin', viewModel),
  ]),
  create: (viewModel, { __ }) => __('\'{{groupName}}\' group created. ', viewModel),
  delete: (viewModel, { __ }) => __('the {{groupName}} group has been deleted.', viewModel),
  invitation: (viewModel, { __, join }) => join([
    __('You have been invited to the \'{{groupName}}\' group.', viewModel),
    viewModel.includeTerms ? __('SMS Up terms of use are.', viewModel) : '',
    __('Reply "{{prefix}}join {{groupName}}" to join.', viewModel),
  ]),
  notify: (viewModel, { __ }) => __('\'{{groupName}}\' group created. ', viewModel),
};

module.exports = autoReplies;
