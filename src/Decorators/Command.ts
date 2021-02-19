import Storage from '../Storage'
import StaticCommandContract from '../BaseCommand/StaticCommandContract'
import { isObject } from '../utils/isType'
import inferCode from '../utils/inferCode'
import { CommandDecoratorOptions } from '../types'

export default function Command(): ClassDecorator
export default function Command(name: string): ClassDecorator
export default function Command(
  options: CommandDecoratorOptions
): ClassDecorator

export default function Command(
  codeOrOptions: string | CommandDecoratorOptions = {}
) {
  return (Command: StaticCommandContract) => {
    const code = isObject(codeOrOptions)
      ? codeOrOptions.code || inferCode(Command.name)
      : codeOrOptions
    const description = isObject(codeOrOptions)
      ? codeOrOptions.description
      : undefined
    const roles = isObject(codeOrOptions) ? codeOrOptions.roles || [] : []
    const permissions = isObject(codeOrOptions)
      ? codeOrOptions.permissions || []
      : []
    const isGuildOnly = isObject(codeOrOptions)
      ? Boolean(codeOrOptions.isGuildOnly)
      : false
    const clientPermissions = isObject(codeOrOptions)
      ? codeOrOptions.clientPermissions || []
      : []
    const clientRoles = isObject(codeOrOptions)
      ? codeOrOptions.clientRoles || []
      : []

    Command.boot()
      .setCode(code)
      .setDescription(description)
      .setPermissions(permissions)
      .setRoles(roles)
      .setGuildOnly(isGuildOnly)
      .setClientPermissions(clientPermissions)
      .setClientRoles(clientRoles)
    Storage.addCommand(Command)
  }
}
