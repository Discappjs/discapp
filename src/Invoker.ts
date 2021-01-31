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

  /**
   * The command instance
   */
  private readonly $command: BaseCommand

  constructor(Command: CommandConstructorContract) {
    this.$command = new Command()
  }

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
    const Command = this.$command.constructor as CommandConstructorContract

    for (const [propertyName, argumentName] of Command.$assocs.entries()) {
      const argDefinition = Command.getArgument(argumentName)
      const hasArg = this.$context.hasArgument(argumentName)

      if (!argDefinition.isRequired && !hasArg) {
        continue
      }

      if (hasArg) {
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
    /**
     * Call the global 'beforeCommand' hooks with, usefull
     * for third party codes being able to hook Discapp
     */
    await callEach(this.$hooks.beforeCommand, [
      {
        context: this.$context,
        command: this.$command.constructor,
      },
    ])

    this.setAssociatedProperties()

    /**
     * Call the global 'afterCommand' hooks. Useful
     * for plugins to being able to hook into a
     * Discapp application.
     */
    await this.$command.beforeExecute()

    const response = await this.$command.execute()

    /**
     * Executes the 'afterExecute' function, if it exists
     * after executing the command
     */
    await this.$command.afterExecute()

    /**
     * Call the global 'afterCommand' hooks. Useful
     * for plugins to being able to hook into a
     * Discapp application.
     */
    await callEach(this.$hooks.afterCommand, [
      {
        context: this.$context,
        command: this.$command.constructor,
      },
    ])

    return response
  }
}
