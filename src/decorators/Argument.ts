import { storage } from '../Storage'
import { ArgumentDescriptor, ArgumentDecoratorOptions } from '../types'

export default function Argument(options?: string | ArgumentDecoratorOptions) {
  return (target: any, property: string) => {
    const definition: ArgumentDescriptor = {
      name: '',
      isRequired: true,
    }

    if (!options) {
      definition.name = property
    } else if (typeof options === 'string') {
      definition.name = options
    } else if (typeof options === 'object') {
      options.name = options.name

      if (options.description) {
        definition.description = options.description
      }

      if (!options.isRequired) {
        definition.isRequired = false
      }
    }

    storage
      .getOrCreateCommand(target)
      .addAssoc(property, definition.name)
      .addArgument(definition)

    return target
  }
}
