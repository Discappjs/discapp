import { DMChannel, NewsChannel, TextChannel, User } from 'discord.js'
import CommandContract from './BaseCommand/CommandContract'
import CommandContextContract from './CommandContext/CommandContextContract'

export interface CommandDecoratorOptions {
  code: string
  description: string
}

export interface ArgumentDescriptor {
  name: string
  description?: string
  isRequired: boolean
  type: any
}

export interface ArgumentDecoratorOptions {
  name?: string
  description?: string
  isRequired?: boolean
}

export interface MessageContract {
  readonly content: string
  readonly author: User
  readonly channel: TextChannel | DMChannel | NewsChannel
}

export interface DiscappConfig {
  commandsDirectory: string
  token: string
  hooks: DiscappHooks
  prefix: string
}

export interface InvokerHooks {
  afterCommand: Function[]
  beforeCommand: Function[]
}

export interface DiscappHooks extends InvokerHooks {}

export type CommandHookFunction = (command: {
  context: CommandContextContract
  descriptor: CommandContract
}) => void
