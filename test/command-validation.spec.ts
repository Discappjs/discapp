import { Argument, BaseCommand, Command, Storage } from '../src'

describe('Command validation', () => {
  afterEach(() => Storage.clear())

  describe('dos', () => {
    it('should allow command without arguments', () => {
      @Command('command')
      class MyCommand extends BaseCommand {
        public async execute() {}
      }

      expect(() => MyCommand.validate()).not.toThrow()
    })

    it('should allow command with any number of required arguments', () => {
      @Command('first')
      class FirstCommand extends BaseCommand {
        @Argument()
        public first: string

        public async execute() {}
      }

      @Command('second')
      class SecondCommand extends BaseCommand {
        @Argument()
        public first: string

        @Argument()
        public second: string

        public async execute() {}
      }

      @Command('third')
      class ThirdCommand extends BaseCommand {
        @Argument()
        public first: string

        @Argument()
        public second: string

        @Argument()
        public third: string

        public async execute() {}
      }

      expect(() => {
        const commands = [FirstCommand, SecondCommand, ThirdCommand]
        for (const Command of commands) Command.validate()
      }).not.toThrow()
    })

    it("should allow first argument to be an array if there's only one argument", () => {
      @Command('command')
      class MyCommand extends BaseCommand {
        @Argument()
        public first: string[]

        public async execute() {}
      }

      expect(() => MyCommand.validate()).not.toThrow()
    })

    it('should allow last argument as array', () => {
      @Command('command')
      class MyCommand extends BaseCommand {
        @Argument()
        public first: string

        @Argument()
        public second: string[]

        public async execute() {}
      }

      expect(() => MyCommand.validate()).not.toThrow()
    })

    it("should allow first optional argument if there's only one argument", () => {
      @Command('command')
      class MyCommand extends BaseCommand {
        @Argument({
          isRequired: false,
        })
        public first: string

        public async execute() {}
      }

      expect(() => MyCommand.validate()).not.toThrow()
    })

    it("should allow first optional argument if there's only one argumment", () => {
      @Command('command')
      class MyCommand extends BaseCommand {
        @Argument({
          isRequired: false,
        })
        public first: string

        public async execute() {}
      }

      expect(() => MyCommand.validate()).not.toThrow()
    })

    it('should allow optional argument only if argument are followed only by optional arguments', () => {
      @Command('command')
      class MyCommand extends BaseCommand {
        @Argument({
          isRequired: false,
        })
        public first: string

        @Argument({
          isRequired: false,
        })
        public second: string

        @Argument({
          isRequired: false,
        })
        public third: string

        public async execute() {}
      }

      expect(() => MyCommand.validate()).not.toThrow()
    })

    it('should allow required argument followed by optional arguments', () => {
      @Command('command')
      class MyCommand extends BaseCommand {
        @Argument()
        public first: string

        @Argument({
          isRequired: false,
        })
        public second: string

        public async execute() {}
      }

      expect(() => MyCommand.validate()).not.toThrow()
    })
  })

  describe("don'ts", () => {
    it("should not allow array argument as first argument if there's more than one argument", () => {
      @Command('command')
      class MyCommand extends BaseCommand {
        @Argument()
        public first: string[]

        @Argument({
          isRequired: false,
        })
        public second: string

        public async execute() {}
      }

      expect(() => MyCommand.validate()).toThrow()
    })

    it('should not allow two array arguments', () => {
      @Command('command')
      class MyCommand extends BaseCommand {
        @Argument()
        public first: string[]

        @Argument()
        public second: string[]

        public async execute() {}
      }

      expect(() => MyCommand.validate()).toThrow()
    })

    it('should not allow array argument followed by optional array argument', () => {
      @Command('command')
      class MyCommand extends BaseCommand {
        @Argument()
        public first: string[]

        @Argument({
          isRequired: false,
        })
        public second: string[]

        public async execute() {}
      }

      expect(() => MyCommand.validate()).toThrow()
    })

    it('should not allow optional argument followed by required argument', () => {
      @Command('command')
      class MyCommand extends BaseCommand {
        @Argument({
          isRequired: false,
        })
        public first: string

        @Argument()
        public second: string

        public async execute() {}
      }

      expect(() => MyCommand.validate()).toThrow()
    })

    it('should not allow optional argument between required arguments', () => {
      @Command('command')
      class MyCommand extends BaseCommand {
        @Argument()
        public first: string

        @Argument({
          isRequired: false,
        })
        public second: string

        @Argument()
        public third: string

        public async execute() {}
      }

      expect(() => MyCommand.validate()).toThrow()
    })
  })
})
