import Storage from '../Storage'
import { isObject } from '../utils/isType'
import { CommandDecoratorOptions } from '../types'

export default function Command(name: string): ClassDecorator
export default function Command(
  options: CommandDecoratorOptions
): ClassDecorator

export default function Command(
  nameOrOptions: string | CommandDecoratorOptions
) {
  return (Command: any) => {
    const name = isObject(nameOrOptions) ? nameOrOptions.name : nameOrOptions
    const description = isObject(nameOrOptions)
      ? nameOrOptions.description
      : undefined

    Command.boot()
    Command.setName(name).setDescription(description)
    Storage.addCommand(Command)

    return Command
  }
}
