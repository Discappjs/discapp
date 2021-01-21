import { storage } from '../Storage'
import { CommandDecoratorOptions } from '../types'

export default function Command(options: string | CommandDecoratorOptions) {
  return (Command: any) => {
    const descriptor = storage.getOrCreateCommand(Command.prototype)

    if (typeof options === 'string') {
      descriptor.setName(options)
    } else if (typeof options === 'object') {
      descriptor.setName(options.name).setDescription(options.description)
    }

    descriptor.setInstance(new Command())

    return Command
  }
}
