import { Message, PermissionString, User } from 'discord.js'
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
  readonly commandsDirectory: string
  readonly token: string
  hooks: DiscappHooks
  readonly prefix: string
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

export type UserContract = User
export type MemberContract = MessageContract['member']
export type GuildContract = MessageContract['guild']
export type ChannelContract = MessageContract['channel']
