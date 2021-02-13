import { Argument, BaseCommand, Command, Parser, Storage } from '../src'

describe('Input validation', () => {
  afterEach(() => Storage.clear())

  it('should throw when argument is missing', () => {
    @Command('command')
    class MissingArgument extends BaseCommand {
      @Argument()
      public first: string

      @Argument()
      public second: string

      public async execute() {}
    }

    expect(() =>
      new Parser('command foo').forCommand(MissingArgument).isValid()
    ).toThrow("Argument 'second' (2º) is required")
  })

  it('should throw when array argument is missing', () => {
    @Command('command')
    class MissingArgument extends BaseCommand {
      @Argument()
      public first: string[]

      public async execute() {}
    }

    expect(() =>
      new Parser('command').forCommand(MissingArgument).isValid()
    ).toThrow("Argument 'first' (1º) is required")
  })

  it('should throw when number is expected but nan is given', () => {
    @Command('numeric')
    class NumericArgument extends BaseCommand {
      @Argument()
      public first: number

      public async execute() {}
    }

    expect(() =>
      new Parser('numeric nan').forCommand(NumericArgument).isValid()
    ).toThrow("Argument 'first' (1º) expects a numeric value, 'nan' given")
  })

  it('should return false when code does not  match', () => {
    @Command('numeric')
    class UnmatchedCommand extends BaseCommand {
      public async execute() {}
    }

    expect(new Parser().forCommand(UnmatchedCommand).isValid()).toBe(false)
  })
})
