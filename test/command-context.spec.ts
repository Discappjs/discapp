import { CommandContext } from '../src'

describe('Command context', () => {
  const context = new CommandContext()

  afterEach(() => context.clear())

  it('should correctly attribute values to keys', () => {
    context.setArgument('key', 'value')

    expect(context.getArgument('key')).toBe('value')
  })

  it('should correctly remove the argument', () => {
    context.setArgument('key', 'value')
    context.removeArgument('key')

    expect(context.getArgument('key')).toBeUndefined()
  })

  it('should clear the context', () => {
    context.setArgument('key', 'value')
    context.setArgument('key2', 'value')

    context.clear()

    expect(context.getArgument('key')).toBeUndefined()
    expect(context.getArgument('key2')).toBeUndefined()
  })

  it("should not allow 'author' as argument key", () => {
    expect(() => context.setArgument('author', 'me')).toThrow()
  })

  it("should not allow 'channel' as argument key", () => {
    expect(() => context.setArgument('channel', 'me')).toThrow()
  })
})
