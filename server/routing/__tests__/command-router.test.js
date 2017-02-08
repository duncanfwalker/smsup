jest.mock('../aliases', () => () => ({
  join: { type: 'join', language: 'en' },
  'پیوستن': { type: 'join', language: 'fa' }, // eslint-disable-line quote-props
}));
jest.mock('../view-render', () => jest.fn());
const { Command, run, clear } = require('../command-router');
const InvalidCommandError = require('../invalid-command-error');
const viewRender = require('../view-render');

describe('Mobile originated message parsing', () => {
  describe('route matching', () => {
    const controllerSpy = jest.fn().mockReturnValue(Promise.resolve());
    const target = { controllerMethod: controllerSpy, anotherMethod: () => Promise.resolve() };
    afterEach(() => {
      controllerSpy.mockClear();
      viewRender.mockClear();
      clear();
    });
    it('one word command route to controller', () => {
      Command('commandKeyword')(target, 'controllerMethod');

      return run({ text: 'commandKeyword' })
        .then(() => {
          expect(controllerSpy).toHaveBeenCalled();
        });
    });

    it('controller receives param from route', () => {
      Command('oneParamKeyword :first')(target, 'controllerMethod');

      return run({ text: 'oneParamKeyword firstMatch' })
        .then(() => {
          const params = {first: 'firstMatch'};
          expect(controllerSpy).toBeCalledWith({params}, expect.anything());
        });
    });

    it('controller receives multiple params from route', () => {
      Command('multi :first :second')(target, 'controllerMethod');

      return run({ text: 'multi firstMatch secondMatch' })

      .then(() => {
        const params = {first: 'firstMatch', second: 'secondMatch'};
        expect(controllerSpy).toBeCalledWith({params}, expect.anything());
      });
    });

    it('handles splat', () => {
      Command(':groupName *')(target, 'controllerMethod');

      return run({ text: 'accleaders hi everyone in the accleaders group' })

        .then(() => {
          const params = {groupName: 'accleaders', splat: 'hi everyone in the accleaders group'};
          expect(controllerSpy).toBeCalledWith({params}, expect.anything());
        });
    });


    it('passed result to the view', () => {
      Command('commandKeyword')(target, 'controllerMethod');
      const viewModel = { 'model': 'value' };
      controllerSpy.mockReturnValue(Promise.resolve(viewModel));

      return run({ text: 'commandKeyword' })

        .then(() => {
          expect(viewRender).toBeCalledWith('controllerMethod', viewModel, expect.anything());
        });
    });

    describe('priority order', () => {
      const scenarios = [
        { methods: ['controllerMethod', 'anotherMethod'], controllerMethodCalled: 1},
        { methods: ['anotherMethod', 'controllerMethod'], controllerMethodCalled: 0},
      ];
      scenarios.forEach(({methods, controllerMethodCalled}) => {
        it('priorities commands in the order they are written', () => {
          Command('ambiguousKeyword')(target, methods[0]);
          Command('ambiguousKeyword')(target, methods[1]);

          return run({ text: 'ambiguousKeyword' })

            .then(() => {
              expect(controllerSpy).toHaveBeenCalledTimes(controllerMethodCalled);
            });
        });
      });
    });

    it('errors on an unknown command', () => {
      expect.assertions(1);
      return run({ text: 'no match' })
        .catch(error => {
          expect(error).toEqual(expect.any(InvalidCommandError));
        });
    });
  });
});
