import { DMChannel, NewsChannel, TextChannel, User } from 'discord.js'
import BaseCommand from './BaseCommand'
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
  descriptor: BaseCommand
}) => void

export interface CommandConstructorContract {
  $name: string
  $description: string
  $arguments: ArgumentDescriptor[]
  $assocs: Map<string, string>

  new (): BaseCommand
  boot(): void
  setName(name: string): this
  setDescription(description: string): this
  addAssoc(property: string, key: string): this
  addArgument(arg: ArgumentDescriptor): this
}
