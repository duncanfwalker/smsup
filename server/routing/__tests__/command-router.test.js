jest.mock('../aliases', () => jest.fn());
jest.mock('../view-render', () => jest.fn());
const { Command, run, clear } = require('../command-router');
const InvalidCommandError = require('../invalid-command-error');
const viewRender = require('../view-render');
const aliases = require('../aliases');

describe('Mobile originated message parsing', () => {
  const controllerSpy = jest.fn().mockReturnValue(Promise.resolve());
  const target = { controllerMethod: controllerSpy, anotherMethod: () => Promise.resolve() };
  describe('route matching', () => {
    aliases.mockImplementation(word => ([{ locale: 'en', alias: word }]));
    afterEach(() => {
      controllerSpy.mockClear();
      viewRender.mockClear();
      aliases.mockClear();
      clear();
    });
    it('one word command route to controller', () => {
      Command('commandKeyword')(target, 'controllerMethod');

      return run({ text: 'commandKeyword' })
        .then(() => {
          expect(controllerSpy).toHaveBeenCalled();
        });
    });

    it('command keywords are case insensitive', () => {
      Command('commandkeyword')(target, 'controllerMethod');

      return run({ text: 'COMMANDKEYWORD' })
        .then(() => {
          expect(controllerSpy).toHaveBeenCalled();
        });
    });

    it('controller receives param from route', () => {
      Command('oneParamKeyword :first')(target, 'controllerMethod');

      return run({ text: 'oneParamKeyword firstMatch' })
        .then(() => {
          const params = { first: 'firstMatch' };
          expect(controllerSpy).toBeCalledWith({ params, language: 'en' }, expect.anything());
        });
    });

    it('controller receives multiple params from route', () => {
      Command('multi :first :second')(target, 'controllerMethod');

      return run({ text: 'multi firstMatch secondMatch' })

        .then(() => {
          const params = { first: 'firstMatch', second: 'secondMatch' };
          expect(controllerSpy).toBeCalledWith({ params, language: 'en' }, expect.anything());
        });
    });

    xit('handles splat at start', () => {
      Command('* to :groupName')(target, 'controllerMethod');

      return run({ text: 'hi everyone in the accleaders group accleaders' })

        .then(() => {
          const params = { groupName: 'accleaders', splat: 'hi everyone in the accleaders group' };
          expect(controllerSpy).toBeCalledWith({ params }, expect.anything());
        });
    });

    it('handles splat', () => {
      Command(':groupName *')(target, 'controllerMethod');

      return run({ text: 'accleaders hi everyone in the accleaders group' })

        .then(() => {
          const params = { groupName: 'accleaders', splat: 'hi everyone in the accleaders group' };
          expect(controllerSpy).toBeCalledWith({ language: 'en', params }, expect.anything()); // TODO: use toBeCalledWithMatch
        });
    });


    it('passed result to the view', () => {
      Command('commandKeyword')(target, 'controllerMethod');
      const viewModel = { model: 'value' };
      controllerSpy.mockReturnValue(Promise.resolve(viewModel));

      return run({ text: 'commandKeyword' })

        .then(() => {
          expect(viewRender).toBeCalledWith('controllerMethod', viewModel, expect.anything());
        });
    });


    describe('priority order', () => {
      const scenarios = [
        { methods: ['controllerMethod', 'anotherMethod'], controllerMethodCalled: 1 },
        { methods: ['anotherMethod', 'controllerMethod'], controllerMethodCalled: 0 },
      ];
      scenarios.forEach(({ methods, controllerMethodCalled }) => {
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
        .catch((error) => {
          expect(error).toEqual(expect.any(InvalidCommandError));
        });
    });
  });


  describe('command i18n', () => {
    beforeEach(() => {
      viewRender.mockImplementation((viewName, viewModel, options) => options.language);
      aliases.mockReturnValue([{ locale: 'en', alias: 'leave' }, { locale: 'fa', alias: 'خارج' }]);
    });
    afterEach(() => {
      controllerSpy.mockClear();
      viewRender.mockClear();
      aliases.mockClear();
      clear();
    });
    it('routes i18n keyword aliases to controller actions', () => {
      Command('leave')(target, 'controllerMethod');
      return Promise.all(
        [
          run({ text: 'leave' }),

          run({ text: 'خارج' }),
        ],
      )

        .then(() => {
          expect(controllerSpy).toHaveBeenCalledTimes(2);
        });
    });

    const scenarios = [
      { command: 'leave', language: 'en' },
      { command: 'خارج', language: 'fa' },
    ];

    scenarios.forEach(({ command, language }) => {
      it(`routes i18n keyword aliases to controller actions ${command}`, () => {
        Command('leave')(target, 'controllerMethod');

        return run({ text: command })

          .then(reply => expect(reply).toEqual(language));
      });
    });
  });
});
