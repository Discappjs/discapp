import { MessageContract } from '../types'

export default interface CommandContextContract {
  readonly content: string

  setAuthor(author: MessageContract['author'] | undefined): this
  setChannel(channel: MessageContract['channel'] | undefined): this
  setGuild(guild: MessageContract['guild'] | undefined): this
  has(key: string): boolean
  set(key: string, value: any): this
  get(key: string): any
  delete(key: string): this
  getAuthor(): MessageContract['author'] | undefined
  getChannel(): MessageContract['channel'] | undefined
  getChannel(): MessageContract['channel'] | undefined
  getMember(): MessageContract['member'] | undefined
  getGuild(): MessageContract['guild'] | undefined
  getMessage(): MessageContract | undefined
  clear(): this
  isGuild(): boolean
}
