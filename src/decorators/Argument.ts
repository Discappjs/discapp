import { CommandConstructorContract, ArgumentDecoratorOptions } from '../types'

export default function Argument(): PropertyDecorator
export default function Argument(name: string): PropertyDecorator
export default function Argument(
  options: ArgumentDecoratorOptions
): PropertyDecorator

export default function Argument(
  nameOrOptions?: string | ArgumentDecoratorOptions
) {
  return (target: any, property: string) => {
    const Command = target.constructor as CommandConstructorContract

    Command.boot()

    if (!nameOrOptions) {
      Command.addAssoc(property, property).addArgument({
        name: property,
        isRequired: true,
      })

      return target
    }

    if (typeof nameOrOptions === 'string') {
      Command.addAssoc(property, nameOrOptions).addArgument({
        name: nameOrOptions,
        isRequired: true,
      })

      return target
    }

    if (typeof nameOrOptions === 'object') {
      Command.addAssoc(property, nameOrOptions.name).addArgument({
        name: nameOrOptions.name,
        description: nameOrOptions.description,
        isRequired:
          nameOrOptions.isRequired === undefined
            ? true
            : nameOrOptions.isRequired,
      })

      return target
    }
  }
}
