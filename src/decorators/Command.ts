import Storage from '../Storage'
import { CommandDecoratorOptions } from '../types'

export default function Command(name: string): ClassDecorator
export default function Command(
  options: CommandDecoratorOptions
): ClassDecorator

export default function Command(
  nameOrOptions: string | CommandDecoratorOptions
) {
  return (Command: any) => {
    Command.boot()

    const name =
      typeof nameOrOptions === 'object' ? nameOrOptions.name : nameOrOptions
    const description =
      typeof nameOrOptions === 'object' ? nameOrOptions.description : undefined

    Command.setName(name).setDescription(description)

    Storage.addCommand(Command)

    return Command
  }
}
