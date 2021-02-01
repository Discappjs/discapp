import { Command, BaseCommand, Storage } from '../../src'

describe('@Command', () => {
  afterEach(() => Storage.clear())

  it('should register the command', () => {
    @Command('command')
    class MyCommand extends BaseCommand {
      public execute() {}
    }

    expect(Storage.getCommand('command')).toBe(MyCommand)
  })

  it('should inject the code and description', () => {
    @Command({
      code: 'command',
      description: 'description',
    })
    class MyCommand extends BaseCommand {
      public execute() {}
    }

    expect(MyCommand.code).toBe('command')
    expect(MyCommand.description).toBe('description')
  })
})
