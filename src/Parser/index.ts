import Storage from '../Storage'
import CommandContext from '../CommandContext'
import ParserContract from './ParserContract'
import BadInputException from '../Exceptions/BadInputException'
import StaticCommandContract from '../BaseCommand/StaticCommandContract'
export default class Parser implements ParserContract {
  /**
   * The name of the input
   */
  private readonly $commandCode: string = ''

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

    this.$commandCode = splittedInput.shift()
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
    if (this.$commandCode === this.$command.code) {
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
              1}º) expects a numeric value, '${input}' given`
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
          context.set(name, this.$arguments.slice(i))
        } else {
          const argValue: string = this.$arguments[i]

          /**
           * If ther argument is optional and value is not given,
           * then continues
           */
          if (!isRequired && argValue === undefined) {
            ++i
            continue
          }

          /***
           * If the Argument is of type User, then we should
           * convert it to an Discord.js User instance
           */
          if (type.name === 'User') {
            if (argValue.startsWith('<@') && argValue.endsWith('>')) {
              let mention = argValue.slice(2, -1)

              if (mention.startsWith('!')) {
                mention = mention.slice(1)
              }

              const user = Storage.getApp()
                .getClient()
                .users.cache.get(mention)

              context.set(name, user)
            } else {
              /**
               * If the mention is not valid, then we must warn the user.
               *
               * Mention arguments can only be validated at execution
               * time, otherwise we would have to check twice if the
               * user is present in the users cache.
               */
              throw new BadInputException(
                'ARGUMENT_IS_NOT_A_MENSION',
                this.$command.code,
                name,
                `Argument '${name}' (${i +
                  1}º) expected a mention as value, received: '${argValue}'`
              )
            }
          } else {
            /**
             * If the argument is a numeric argument, thne we have
             * to cast it to number
             */
            const value = type === Number ? Number(argValue) : argValue

            context.set(name, value)
          }

          ++i
        }
      }
    }

    return context
  }
}
