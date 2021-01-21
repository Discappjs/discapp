import { DMChannel, NewsChannel, TextChannel, User } from 'discord.js'
import { CommandDescriptor } from '.'
import CommandContext from './CommandContext'

export interface CommandContract {
  execute(): any
}

export interface CommandDecoratorOptions {
  name: string
  description: string
}

export interface ArgumentDescriptor {
  name: string
  description?: string
  isRequired: boolean
}

export interface ArgumentDecoratorOptions {
  name: string
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
  context: CommandContext
  descriptor: CommandDescriptor
}) => void
