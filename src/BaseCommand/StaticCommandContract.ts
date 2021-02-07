import CommandContract from './CommandContract'
import { ArgumentDescriptor } from '../types'
import { Collection } from '../Collections'
import { PermissionString } from 'discord.js'

export default interface StaticCommandContract {
  code: string
  description: string
  $arguments: ArgumentDescriptor[]
  $guildOnly: boolean
  readonly $assocs: Map<string, string>
  readonly $roles: Collection
  readonly $permissions: Collection

  new (): CommandContract
  boot(): this
  setCode(name: string): this
  setDescription(description: string): this
  addAssoc(propertyKey: string, argumentKey: string): this
  addArgument(arg: ArgumentDescriptor): this
  setGuildOnly(guildOnly: boolean): this
  setPermissions(permissions: PermissionString[] | Collection): this
  setRoles(roles: Collection | string[]): this
  getArgument(name: string): ArgumentDescriptor | undefined
  validate(): void
}
