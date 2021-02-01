import { Argument, BaseCommand, Command, Storage, Parser } from '../src'

describe('Parser', () => {
  afterEach(() => Storage.clear())

  it("should correctly parse array input when it's the first argument", () => {
    @Command('array')
    class ArrayCommand extends BaseCommand {
      @Argument()
      public arrayArg: string[]

      public execute() {}
    }

    const context = new Parser('array foo bar')
      .forCommand(ArrayCommand)
      .makeContext()

    expect(context.get('arrayArg')).toEqual(['foo', 'bar'])
  })

  it("should correctly parse array argument when it's the last argument", () => {
    @Command('array')
    class ArrayCommand extends BaseCommand {
      @Argument()
      public beforeArray: string

      @Argument()
      public arrayArg: string[]

      public execute() {}
    }

    const context = new Parser('array first foo bar')
      .forCommand(ArrayCommand)
      .makeContext()

    expect(context.get('beforeArray')).toBe('first')
    expect(context.get('arrayArg')).toEqual(['foo', 'bar'])
  })

  it('should correctly parse optional argument when input is given', () => {
    @Command('optional')
    class OptionalCommand extends BaseCommand {
      @Argument({
        isRequired: false,
      })
      public optionalArg: string

      public execute() {}
    }

    const context = new Parser('optional foo')
      .forCommand(OptionalCommand)
      .makeContext()

    expect(context.get('optionalArg')).toBe('foo')
  })

  it('should correctly parse optional argument when input is not given', () => {
    @Command('optional')
    class OptionalCommand extends BaseCommand {
      @Argument({
        isRequired: false,
      })
      public optionalArg: string

      public execute() {}
    }

    const context = new Parser('optional')
      .forCommand(OptionalCommand)
      .makeContext()

    expect(context.get('optionalArg')).toBe(undefined)
  })

  it('should correctly parse optional arguments when input is given', () => {
    @Command('optional')
    class OptionalCommand extends BaseCommand {
      @Argument({
        isRequired: false,
      })
      public optionalArg: string

      @Argument({
        isRequired: false,
      })
      public secondOptionalArg: string

      public execute() {}
    }

    const context = new Parser('optional foo bar')
      .forCommand(OptionalCommand)
      .makeContext()

    expect(context.get('optionalArg')).toBe('foo')
    expect(context.get('secondOptionalArg')).toBe('bar')
  })

  it('should correctly parse optional arguments when input for one of the arguments is not given', () => {
    @Command('optional')
    class OptionalCommand extends BaseCommand {
      @Argument({
        isRequired: false,
      })
      public optionalArg: string

      @Argument({
        isRequired: false,
      })
      public secondOptionalArg: string

      public execute() {}
    }

    const context = new Parser('optional foo')
      .forCommand(OptionalCommand)
      .makeContext()

    expect(context.get('optionalArg')).toBe('foo')
    expect(context.get('secondOptionalArg')).toBe(undefined)
  })

  it('should correctly parse optional arguments when input for none of the arguments is not given', () => {
    @Command('optional')
    class OptionalCommand extends BaseCommand {
      @Argument({
        isRequired: false,
      })
      public optionalArg: string

      @Argument({
        isRequired: false,
      })
      public secondOptionalArg: string

      public execute() {}
    }

    const context = new Parser('optional')
      .forCommand(OptionalCommand)
      .makeContext()

    expect(context.get('optionalArg')).toBe(undefined)
    expect(context.get('secondOptionalArg')).toBe(undefined)
  })

  it('should cast to number when argument is numeric', () => {
    @Command('numeric')
    class NumericCommand extends BaseCommand {
      @Argument()
      public numericArg: number

      public execute() {}
    }

    const context = new Parser('numeric 5')
      .forCommand(NumericCommand)
      .makeContext()

    expect(context.get('numericArg')).toBe(5)
  })

  it('should not cast to number when argument is not numeric', () => {
    @Command('text')
    class TextCommand extends BaseCommand {
      @Argument()
      public textArg: string

      public execute() {}
    }

    const context = new Parser('text 5').forCommand(TextCommand).makeContext()

    expect(context.get('textArg')).toBe('5')
  })
})
