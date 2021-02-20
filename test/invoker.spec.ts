import { Argument, BaseCommand, Command, CommandContext, Storage } from '../src'
import Invoker from '../src/Invoker'
import { makeFakeContext } from './helpers/factories'

describe('Invoker', () => {
  afterEach(() => Storage.clear())

  it('should correctly inject the arguments', async () => {
    const context = makeFakeContext()

    context.set('foo', 'bar')

    @Command('command')
    class FooCommand extends BaseCommand {
      @Argument()
      public foo: string

      public async execute() {
        return this
      }
    }

    const response = await new Invoker(FooCommand).withContext(context).invoke()

    expect(response.foo).toBe('bar')
  })

  it('should not inject when command is not given', async () => {
    const context = makeFakeContext()

    @Command('command')
    class DefaultValueCommand extends BaseCommand {
      @Argument({
        isRequired: false,
      })
      public foo: string = 'defaultValue'

      public async execute() {
        return this
      }
    }

    const response = await new Invoker(DefaultValueCommand)
      .withContext(context)
      .invoke()

    expect(response.foo).toBe('defaultValue')
  })

  it('should throw when required argument is missing', async () => {
    const context = new CommandContext()

    @Command('command')
    class DefaultValueCommand extends BaseCommand {
      @Argument()
      public foo: string

      public async execute() {
        return this
      }
    }

    expect(async () => {
      await new Invoker(DefaultValueCommand).withContext(context).invoke()
    }).rejects.toThrow()
  })
})
