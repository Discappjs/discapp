import CommandContextContract from './CommandContextContract'
import { MessageContract } from '../types'

export default class CommandContext implements CommandContextContract {
  /**
   * List of reserved words
   */
  private readonly reservedWords = [
    'context',
    'channel',
    'author',
    'member',
    'message',
  ]

  /**
   * The context mapping
   */
  private readonly $context = new Map<string, any>()

  /**
   * The original message content
   */
  private readonly $content: string

  constructor(content = '') {
    this.$content = content

    /**
     * Automatically defines the context as itself,
     * this allow us to get the context in the command
     */
    this.$context.set('context', this)
  }

  /**
   * The untreated content of the message
   */
  get content() {
    return this.$content
  }

  /**
   * Sets the message object
   *
   * @param member
   */
  public setMessage(message: MessageContract) {
    this.$context.set('message', message)

    this.setAuthor(message.author)
      .setChannel(message.channel)
      .setMember(message.member)

    return this
  }

  /**
   * Sets the member of the message
   *
   * @param member The member
   */
  public setMember(member: MessageContract['member'] | null) {
    this.$context.set('member', member)

    return this
  }

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
  public has(key: string) {
    return this.$context.has(key)
  }

  /**
   * Sets the argument
   *
   * @param key The key of the argument
   * @param value The value of the argument
   */
  public set(key: string, value: any) {
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
  public get(key: string) {
    return this.$context.get(key)
  }

  /**
   * Removes the argument
   *
   * @param key The key of the argument
   */
  public delete(key: string) {
    this.$context.delete(key)

    return this
  }

  /**
   * Returns the member of the message
   */
  public getMember() {
    return this.get('member')
  }

  /**
   * Returns the author of the message
   */
  public getAuthor(): MessageContract['author'] | undefined {
    return this.get('author')
  }

  /**
   * Returns the channel the message has been sent to
   */
  public getChannel(): MessageContract['channel'] | undefined {
    return this.get('channel')
  }

  /**
   * Returns the channel the message has been sent to
   */
  public getMessage(): MessageContract | undefined {
    return this.get('message')
  }

  /**
   * Clears the context
   */
  public clear() {
    this.$context.clear()

    return this
  }

  /**
   * Returns if the message was sent from a guild
   */
  public isGuild() {
    return this.getMessage() ? Boolean(this.getMessage().guild) : false
  }
}
