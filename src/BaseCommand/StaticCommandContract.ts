import CommandContract from './CommandContract'
import { ArgumentDescriptor } from '../types'
import { PermissionString } from 'discord.js'

export default interface StaticCommandContract {
  code: string
  description: string
  $arguments: ArgumentDescriptor[]
  readonly $assocs: Map<string, string>
  readonly $roles: Set<string>
  readonly $permissions: Set<PermissionString>

  new (): CommandContract
  boot(): this
  setCode(name: string): this
  setDescription(description: string): this
  addAssoc(propertyKey: string, argumentKey: string): this
  addArgument(arg: ArgumentDescriptor): this
  setPermissions(permissions: PermissionString[]): this
  setRoles(roles: string[]): this
  getArgument(name: string): ArgumentDescriptor | undefined
  validate(): void
}
