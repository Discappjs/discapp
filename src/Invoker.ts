import BaseCommand from './BaseCommand'
import CommandContext from './CommandContext'
import callEach from './utils/callEach'
import { CommandConstructorContract, InvokerHooks } from './types'

export default class Invoker {
  /**
   * The invoker context
   */
  private $context = new CommandContext()

  /**
   * Invoker hooks
   */
  private readonly $hooks: InvokerHooks = {
    afterCommand: [],
    beforeCommand: [],
  }

  constructor(private readonly $command: BaseCommand) {}

  /**
   * Sets the hooks for the invoker
   */
  public withHooks(hooks: InvokerHooks) {
    this.$hooks.beforeCommand.push(...hooks.beforeCommand)
    this.$hooks.afterCommand.push(...hooks.afterCommand)

    return this
  }

  /**
   * Sets the context for this Invoker instance
   *
   * @param context The context
   */
  public withContext(context: CommandContext) {
    this.$context = context

    return this
  }

  /**
   * Set the associateds properties in the command instance
   */
  private setAssociatedProperties() {
    const Command = (this.$command
      .constructor as unknown) as CommandConstructorContract

    for (const [propertyName, argumentName] of Command.$assocs.entries()) {
      if (this.$context.hasArgument(argumentName)) {
        const value = this.$context.getArgument(argumentName)
        this.$command.setProperty(propertyName, value)
      } else {
        throw new Error(`Argument ${argumentName} does not exists`)
      }
    }
  }

  /**
   * Invokes the command
   */
  public async invoke() {
    await callEach(this.$hooks.beforeCommand, [
      {
        context: this.$context,
        command: this.$command.constructor,
      },
    ])

    this.setAssociatedProperties()
    const response = await this.$command.execute()

    await callEach(this.$hooks.afterCommand, [
      {
        context: this.$context,
        command: this.$command.constructor,
      },
    ])

    return response
  }
}