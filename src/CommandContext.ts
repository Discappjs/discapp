import { MessageContract } from './types'

export default class CommandContext {
  /**
   * List of reserved words
   */
  private readonly reservedWords = ['channel', 'message']

  /**
   * The context mapping
   */
  private readonly $context = new Map<string, any>()

  /**
   * Sets the author of the message
   *
   * @param author The author
   */
  public setAuthor(author: MessageContract['author'] | undefined) {
    this.$context.set('author', author)

    return this
  }

  /**
   * Sets the channel
   *
   * @param channel The channel
   */
  public setChannel(channel: MessageContract['channel'] | undefined) {
    this.$context.set('channel', channel)

    return this
  }

  /**
   * Returns if the command has the argument
   *
   * @param key The key of the argument
   */
  public hasArgument(key: string) {
    return this.$context.has(key)
  }

  /**
   * Sets the argument
   *
   * @param key The key of the argument
   * @param value The value of the argument
   */
  public setArgument(key: string, value: any) {
    if (this.reservedWords.includes(key)) {
      throw new Error(`${key} is a reserved word`)
    }

    this.$context.set(key, value)

    return this
  }

  /**
   * Returns the value of the argument
   *
   * @param key The key of the argument
   */
  public getArgument(key: string) {
    return this.$context.get(key)
  }

  /**
   * Removes the argument
   *
   * @param key The key of the argument
   */
  public removeArgument(key: string) {
    this.$context.delete(key)
  }

  /**
   * Returns the author of the message
   */
  public getAuthor(): MessageContract['author'] | undefined {
    return this.getArgument('author')
  }

  /**
   * Returns the channel the message has been sent to
   */
  public getChannel(): MessageContract['channel'] | undefined {
    return this.getArgument('channel')
  }

  /**
   * Clears the context
   */
  public clear() {
    this.$context.clear()
    this.setAuthor(undefined).setChannel(undefined)
  }
}