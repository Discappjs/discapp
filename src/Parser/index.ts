import CommandContext from '../CommandContext'
import BadInputException from '../Exceptions/BadInputException'
import ParserContract from './ParserContract'
import StaticCommandContract from '../BaseCommand/StaticCommandContract'

export default class Parser implements ParserContract {
  /**
   * The name of the input
   */
  private readonly $commandName: string = ''

  /**
   * The arguments of the input
   */
  private readonly $arguments: any[]

  /**
   * The command
   */
  private $command: StaticCommandContract | null = null

  constructor(private $input: string = '') {
    const splittedInput = $input.split(' ')

    this.$commandName = splittedInput.shift()
    this.$arguments = splittedInput
  }

  /**
   * Defines the command to validate against the input
   *
   * @param command The command
   */
  public forCommand(command: any) {
    this.$command = command as StaticCommandContract

    return this
  }

  /**
   * Return if the input matches the command
   */
  public isValid() {
    if (this.$commandName === this.$command.code) {
      let i = 0
      for (const { name, type, isRequired } of this.$command.$arguments) {
        const input = this.$arguments[i]

        /**
         * If argument is required, but input is missing
         * then throw
         */
        if (isRequired && !input) {
          throw new BadInputException(
            'MISSING_ARGUMENT',
            this.$command.code,
            name,
            `Argument '${name}' (${i + 1}º) is required`
          )
        }

        /**
         * If argument is numeric but its value is not numueric
         * then throw
         */
        if (isRequired && type === Number && isNaN(Number(input))) {
          throw new BadInputException(
            'NAN_ARGUMENT',
            this.$command.name,
            name,
            `Argument '${name}' (${i +
              1}º) expects a numeric value, ${input} given`
          )
        }

        ++i
      }

      return true
    }

    return false
  }

  /**
   * Generates the context
   */
  public makeContext() {
    const context = new CommandContext(this.$input)

    if (this.$command) {
      let i = 0
      for (const { name, type, isRequired } of this.$command.$arguments) {
        /**
         * Since an Array argument has to be the last
         * argument, we can for sure put all the remaining
         * values in the argument
         */
        if (type === Array) {
          context.setArgument(name, this.$arguments.slice(i))
        } else {
          const argValue = this.$arguments[i]

          if (!isRequired && argValue === undefined) {
            ++i
            continue
          }

          /**
           * If the argument is a numeric argument, then
           * we have to cast it to number
           */
          const value = type === Number ? Number(argValue) : argValue

          context.setArgument(name, value)
          ++i
        }
      }
    }

    return context
  }
}