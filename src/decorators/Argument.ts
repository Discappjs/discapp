import { isObject, isString } from '../utils/isType'
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
    const definition = {
      name: isObject(nameOrOptions)
        ? nameOrOptions.name || property
        : nameOrOptions,
      description: isObject(nameOrOptions)
        ? nameOrOptions.description
        : undefined,
      type: Reflect.getMetadata('design:type', target, property),
      isRequired: isString(nameOrOptions)
        ? true
        : nameOrOptions.isRequired !== undefined
        ? nameOrOptions.isRequired
        : true,
    }

    Command.boot()
    Command.addAssoc(property, definition.name).addArgument(definition)
  }
}
