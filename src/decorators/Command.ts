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

    Command.boot()
    Command.setCode(code).setDescription(description)
    Storage.addCommand(Command)
  }
}
