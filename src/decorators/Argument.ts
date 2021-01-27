import { CommandConstructorContract, ArgumentDecoratorOptions } from '../types'

export default function Argument(): PropertyDecorator
export default function Argument(name: string): PropertyDecorator
export default function Argument(
  options: ArgumentDecoratorOptions
): PropertyDecorator

export default function Argument(
  nameOrOptions: string | ArgumentDecoratorOptions = {}
) {
  return (target: any, property: string) => {
    const Command = target.constructor as CommandConstructorContract

    /**
     * Clear eventual previous commands data and ensure
     * everything is readyy
     */
    Command.boot()

    const name =
      typeof nameOrOptions === 'string'
        ? nameOrOptions
        : nameOrOptions.name || property
    const description =
      typeof nameOrOptions === 'string' ? undefined : nameOrOptions.description
    const type = Reflect.getMetadata('design:type', target, property)

    /**
     * Registers the argument and its metadata as part of
     * the targeted command.
     */
    Command.addAssoc(property, name).addArgument({
      name,
      description,
      isRequired: true,
      type,
    })

    return target
  }
}
