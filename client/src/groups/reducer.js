export const GROUP_UPDATED = 'settings-groups-updated';
export const GROUP_DELETE_STARTED = 'settings-groups-delete-started';
export const GROUP_RESTORE_ENDED = 'settings-groups-restore-ended';

function immutableSplice(arr = [], start = 0, deleteCount = 1, ...items) {
  return [...arr.slice(0, start), ...items, ...arr.slice(start + deleteCount)];
}

export default function reducer(state, action) {
  switch (action.type) {
    case GROUP_UPDATED:
      const number = state.data.findIndex(group => action.payload.tag === group.tag);
      const data = immutableSplice(state.data, number, 1, action.payload);
      return Object.assign({}, state, { data });
    case GROUP_DELETE_STARTED:
      const deletedIndex = state.data.findIndex(group => action.payload.tag === group.tag);
      const deleted = state.data[deletedIndex];
      return Object.assign({}, state, {
        backup: [...(state.backup || []), deleted],
        data: immutableSplice(state.data, deletedIndex, 1),
      });
    case GROUP_RESTORE_ENDED:
      const restoredIndex = state.backup.findIndex(group => action.payload.tag === group.tag);
      return Object.assign({}, state, { backup: immutableSplice(state.backup, restoredIndex) });
    default:
      return state;
  }
}

export const groupUpdated = ({ tag, phoneNumbers }) => {
  return { type: GROUP_UPDATED, payload: { tag, phoneNumbers } };
};

export const startDelete = (tag) => {
  return { type: GROUP_DELETE_STARTED, payload: { tag } };
};

export const endRestore = (tag) => {
  return { type: GROUP_RESTORE_ENDED, payload: { tag } };
};

