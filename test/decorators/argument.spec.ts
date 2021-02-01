import { Command, BaseCommand, Argument, Storage } from '../../src'

describe('@Argument', () => {
  afterEach(() => Storage.clear())

  it('should register the argument', () => {
    @Command('command')
    class MyCommand extends BaseCommand {
      @Argument()
      public arg: string

      public execute() {}
    }

    expect(MyCommand.getArgument('arg')).toBeDefined()
  })

  it('should register the relation', () => {
    @Command('command')
    class MyCommand extends BaseCommand {
      @Argument()
      public arg: string

      public execute() {}
    }

    expect(MyCommand.$assocs.has('arg')).toBe(true)
    expect(MyCommand.$assocs.get('arg')).toBe('arg')
  })

  it('should allow override argument name', () => {
    @Command('command')
    class MyCommand extends BaseCommand {
      @Argument('otherName')
      public arg: string

      public execute() {}
    }

    expect(MyCommand.getArgument('arg')).toBeUndefined()
    expect(MyCommand.getArgument('otherName')).toBeDefined()
  })

  it('should associate correctly if argument name was overrided', () => {
    @Command('command')
    class MyCommand extends BaseCommand {
      @Argument('otherName')
      public arg: string

      public execute() {}
    }

    expect(MyCommand.$assocs.has('arg')).toBe(true)
    expect(MyCommand.$assocs.get('arg')).toBe('otherName')
  })

  it('should register argument as required by default', () => {
    @Command('command')
    class MyCommand extends BaseCommand {
      @Argument()
      public arg: string

      public execute() {}
    }

    expect(MyCommand.getArgument('arg').isRequired).toBe(true)
  })

  it('should allow override if the argument is required', () => {
    @Command('command')
    class MyCommand extends BaseCommand {
      @Argument({
        isRequired: false,
      })
      public arg: string

      public execute() {}
    }

    expect(MyCommand.getArgument('arg').isRequired).toBe(false)
  })

  it('should correctly infer the argument type', () => {
    @Command('command')
    class MyCommand extends BaseCommand {
      @Argument()
      public stringArg: string

      @Argument()
      public numericArg: number

      @Argument()
      public arrayArg: number[]

      public execute() {}
    }

    expect(MyCommand.getArgument('stringArg').type).toBe(String)
    expect(MyCommand.getArgument('numericArg').type).toBe(Number)
    expect(MyCommand.getArgument('arrayArg').type).toBe(Array)
  })
})
