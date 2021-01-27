import CommandContext from './CommandContext'
import { CommandConstructorContract } from './types'

export default class Parser {
  /**
   * The command namee
   */
  private $name = ''

  /**
   * The arguments of the input
   */
  private $args: any[]

  /**
   * The command
   */
  private $command: CommandConstructorContract | null = null

  constructor(input: string) {
    const splittedInput = input.split(' ')

    this.$name = splittedInput[0]
    this.$args = splittedInput.slice(1)
  }

  /**
   * Defines the command to validate against the input
   *
   * @param commandDescriptor The descriptor of the command
   */
  public forCommand(command: CommandConstructorContract) {
    this.$command = command

    return this
  }

  /**
   * Throws if the input is not valid
   */
  public isValid() {
    if (this.$command) {
      /**
       * Check if the names f the commands are the same
       * TODO: caseSensitive, aliasses
       */
      if (this.$name !== this.$command.$name) {
        return false
      }

      /**
       * Loop through the arguments and validates them
       */
      const numberOfArgsDef = this.$command.$arguments.length
      for (let i = 0; i < numberOfArgsDef; ++i) {
        const currentArgDef = this.$command.$arguments[i]
        const currentArgInput: string = this.$args[i]

        /**
         * Only the last argument can be not required
         */
        if (i !== numberOfArgsDef - 1 && !currentArgDef.isRequired) {
          throw new Error('Optional argument must be the last argument')
        }

        /**
         * If the argument is requireed than the currentArgInput
         * must be defined
         */
        if (currentArgDef.isRequired && !currentArgInput) {
          throw new Error(
            `Missing required argument: ${currentArgDef.name} (#${i}).`
          )
        }
      }
    }

    return true
  }

  /**
   * Generate the context
   */
  public getContext() {
    const context = new CommandContext()

    if (this.$command) {
      const numberOfArgsDef = this.$command.$arguments.length

      for (let i = 0; i < numberOfArgsDef; ++i) {
        const currentArgDef = this.$command.$arguments[i]
        const currentArgInput = this.$args[i]

        /**
         * If the argument is a number, then we must cast the
         * input to a number.
         */
        context.setArgument(
          currentArgDef.name,
          currentArgDef.type === Number
            ? Number(currentArgInput)
            : currentArgInput
        )
      }
    }

    return context
  }
}
