import { Message, PermissionString } from 'discord.js'
import { Collection } from './Collections'
import CommandContract from './BaseCommand/CommandContract'
import CommandContextContract from './CommandContext/CommandContextContract'

export interface CommandDecoratorOptions {
  code?: string
  description?: string
  roles?: string[] | Collection
  permissions?: PermissionString[] | Collection
  isGuildOnly?: boolean
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

export interface MessageContract extends Message {}

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
  command: CommandContract
}) => void
