import api from '../storage';
import { groupUpdated } from '../reducer';

describe('reducer', () => {
  const reducer = api.reducer;
  it('renders without crashing', () => {
    const initialState = {data: [{ tag: 'a', phoneNumbers: ["1", "2"] }]};

    const newPhoneNumbers = ["2", "3"];

    const newState = reducer(initialState, groupUpdated({ tag: 'a', phoneNumbers: newPhoneNumbers }) );

    expect(newState.data).toEqual([{ tag: 'a', phoneNumbers: newPhoneNumbers }])
  });


  it('renders without crashing', () => {
    const initialState =  {data:[{ tag: 'a' }, { tag: 'b' }] };

    const newPhoneNumbers = ["2", "3"];

    const newState = reducer(initialState, groupUpdated({ tag: 'b', phoneNumbers: newPhoneNumbers }) );

    expect(newState.data).toEqual([{ tag: 'a' }, { tag: 'b', phoneNumbers: newPhoneNumbers}])
  });
});
