export const PAGE_RECEIVED = 'message-page-received';


export default function reducer(state, action) {
  switch (action.type) {
    case PAGE_RECEIVED:
      const { data } = action.payload;
      const nextOffset = data.nextOffset;
      const pageSize = state.pageSize || nextOffset;
      const existing = state.all || [];
      const withPage = [...existing, ...data.messages];
      return Object.assign({}, state, { all: withPage, nextOffset, pageSize });
    default:
      return state;
  }
}

export const receivePage = (dispatch, offset) => (error, data) => {
  if (error === null) {
    dispatch({ type: PAGE_RECEIVED, payload: { offset, data } });
  }
};


export const requestPage = gettter => (dispatch, getState) => {
  const offset = getState().messages.nextOffset;
  dispatch(gettter({ offset }, receivePage(dispatch)));
};
