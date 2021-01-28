import CommandContext from './CommandContext'
import BadInputException from './exceptions/BadInputException'
import { CommandConstructorContract } from './types'

export default class Parser {
  /**
   * The name of the input
   */
  private readonly $name: string = ''

  /**
   * The arguments of the input
   */
  private readonly $arguments: any[]

  /**
   * The command
   */
  private $command: CommandConstructorContract | null = null

  constructor(private readonly $input: string) {
    ;[this.$name, ...this.$arguments] = $input.split(' ')
  }

  /**
   * Defines the command to validate against the input
   *
   * @param command The command
   */
  public forCommand(command: CommandConstructorContract) {
    this.$command = command

    return this
  }

  /**
   * Return if the input matches the command
   */
  public isValid() {
    if (this.$name === this.$command.$name) {
      let i = 0
      for (const argDef of this.$command.$arguments) {
        const input = this.$arguments[i]

        if (argDef.isRequired && !input) {
          throw new BadInputException(
            'MISSING_ARGUMENT',
            this.$command.$name,
            argDef.name,
            `Argument '${argDef.name}' (${i + 1}º) is required`
          )
        }

        if (
          argDef.isRequired &&
          argDef.type === Number &&
          isNaN(Number(input))
        ) {
          throw new BadInputException(
            'NAN_ARGUMENT',
            this.$command.name,
            argDef.name,
            `Argument '${argDef.name}' (#${i + 1}º) should be a numeric value`
          )
        }

        ++i
      }

      return true
    }

    return false
  }

  /**
   * Generate the context
   */
  public getContext() {
    const context = new CommandContext(this.$input)

    if (this.$command) {
      let i = 0
      for (const { name, type } of this.$command.$arguments) {
        /**
         * Since an Array argument has to be the last
         * argument, we can for sure put all the remaining
         * values.
         */
        if (type === Array) {
          context.setArgument(name, this.$arguments.slice(i))
        } else {
          /**
           * If the argument is a numeric argument, then
           * we cast it to number.
           */
          context.setArgument(
            name,
            type === Number ? Number(this.$arguments[i]) : this.$arguments[i]
          )
          ++i
        }
      }
    }

    return context
  }
}
