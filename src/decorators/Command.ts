import { storage } from '../Storage'
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

    if (typeof nameOrOptions === 'object') {
      Command.setName(nameOrOptions.name).setDescription(
        nameOrOptions.description
      )
    } else {
      Command.setName(nameOrOptions)
    }

    storage.addCommand(Command)
  }
}
