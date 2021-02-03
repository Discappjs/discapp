import { CommandContext } from '../src'

describe('Command context', () => {
  const context = new CommandContext()

  afterEach(() => context.clear())

  it('should correctly attribute values to keys', () => {
    context.set('key', 'value')

    expect(context.get('key')).toBe('value')
  })

  it('should correctly remove the argument', () => {
    context.set('key', 'value')
    context.delete('key')

    expect(context.get('key')).toBeUndefined()
  })

  it('should clear the context', () => {
    context.set('key', 'value')
    context.set('key2', 'value')

    context.clear()

    expect(context.get('key')).toBeUndefined()
    expect(context.get('key2')).toBeUndefined()
  })

  it("should not allow 'author' as argument key", () => {
    expect(() => context.set('author', 'me')).toThrow()
  })

  it("should not allow 'channel' as argument key", () => {
    expect(() => context.set('channel', 'me')).toThrow()
  })
})
