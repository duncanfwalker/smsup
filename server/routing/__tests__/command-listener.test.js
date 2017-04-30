const { on, reset, runListeners } = require('../command-listener');

describe('command-listener', () => {
  const listener = jest.fn();
  afterEach(() => {
    listener.mockClear();
    reset();
  });
  it('ignores events with no listener', () => {
    const event = {};
    runListeners('someCommand', event);
  });

  it('calls single listener', () => {
    on('someCommand', listener);

    const event = {};
    runListeners('someCommand', event);

    expect(listener).toBeCalledWith(event);
  });

  it('calls multiple listeners', () => {
    const anotherlistener = jest.fn();
    on('someCommand', listener);
    on('someCommand', anotherlistener);

    const event = {};
    runListeners('someCommand', event);

    expect(listener).toBeCalledWith(event);
    expect(anotherlistener).toBeCalledWith(event);
  });
});
