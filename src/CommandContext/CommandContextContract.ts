import { MessageContract } from '../types'

export default interface CommandContextContract {
  readonly content: string

  setAuthor(author: MessageContract['author'] | undefined): this
  setChannel(channel: MessageContract['channel'] | undefined): this
  hasArgument(key: string): boolean
  setArgument(key: string, value: any): this
  getArgument(key: string): any
  removeArgument(key: string): this
  getAuthor(): MessageContract['author'] | undefined
  getChannel(): MessageContract['channel'] | undefined
  clear(): this
}
