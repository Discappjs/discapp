import Storage from '../Storage'
import StaticCommandContract from '../BaseCommand/StaticCommandContract'
import { isObject } from '../utils/isType'
import { CommandDecoratorOptions } from '../types'

export default function Command(name: string): ClassDecorator
export default function Command(
  options: CommandDecoratorOptions
): ClassDecorator

export default function Command(
  codeOrOptions: string | CommandDecoratorOptions
) {
  return (Command: StaticCommandContract) => {
    const code = isObject(codeOrOptions) ? codeOrOptions.code : codeOrOptions
    const description = isObject(codeOrOptions)
      ? codeOrOptions.description
      : undefined
    const roles = isObject(codeOrOptions) ? codeOrOptions.roles || [] : []
    const permissions = isObject(codeOrOptions)
      ? codeOrOptions.permissions || []
      : []

    Command.boot()
      .setCode(code)
      .setDescription(description)
      .setPermissions(permissions)
      .setRoles(roles)
    Storage.addCommand(Command)
  }
}
