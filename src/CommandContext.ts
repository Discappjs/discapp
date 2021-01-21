import { Channel, User } from 'discord.js'

export default class CommandContext {
  /**
   * The context mapping
   */
  private readonly $context = new Map<string, any>()

  /**
   * The author of the message
   */
  private $author: User | undefined = undefined

  /**
   * The channel the message has been sent
   */
  private $channel: Channel | undefined = undefined

  /**
   * Sets the author of the message
   *
   * @param author The author
   */
  public setAuthor(author: User | undefined) {
    this.$author = author
    return this
  }

  /**
   * Sets the channel
   *
   * @param channel The channel
   */
  public setChannel(channel: Channel | undefined) {
    this.$channel = channel
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
    this.$context.set(key, value)
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
  public getAuthor() {
    return this.$author
  }

  /**
   * Returns the channel the message has been sent to
   */
  public getChannel() {
    return this.$channel
  }

  /**
   * Clears the context
   */
  public clear() {
    this.$context.clear()
    this.setAuthor(undefined).setChannel(undefined)
  }
}
