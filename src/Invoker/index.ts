import CommandContract from '../BaseCommand/CommandContract'
import StaticCommandContract from '../BaseCommand/StaticCommandContract'
import CommandContext from '../CommandContext'
import CommandContextContract from '../CommandContext/CommandContextContract'
import InvokerContract from './InvokerContract'
import callEach from '../utils/callEach'
import { InvokerHooks } from '../types'
import ForbiddenCommandException from '../Exceptions/ForbiddenCommandException'

export default class Invoker implements InvokerContract {
  /**
   * The invoker context
   */
  private $context: CommandContextContract = new CommandContext()

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
  private readonly $command: CommandContract

  /**
   * The command
   */
  private readonly Command: StaticCommandContract

  constructor(Command: any) {
    this.Command = Command
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
   * Check if the user has permission for executing this command
   */
  private checkPermissions() {
    const member = this.$context.getMember()

    if (member) {
      for (const $role of this.Command.$roles) {
        const hasRole = member.roles.cache.find(role => role.name === $role)

        if (!hasRole) {
          throw new ForbiddenCommandException(
            'MISSING_ROLE',
            this.Command.code,
            $role,
            `This commands requires you to have the role: '${$role}', but you don't`
          )
        }
      }

      for (const $permission of this.Command.$permissions) {
        if (!member.hasPermission($permission)) {
          throw new ForbiddenCommandException(
            'MISSING_PERMISSION',
            this.Command.code,
            $permission,
            `This commands requires you to have the permission: '${$permission}', but you don't`
          )
        }
      }
    }

    return true
  }

  /**
   * Set the associateds properties in the command instance
   */
  private setAssociatedProperties() {
    const Command = this.$command.constructor as StaticCommandContract

    for (const [propertyName, argumentName] of Command.$assocs.entries()) {
      const hasArg = this.$context.has(argumentName)
      const argDefinition = Command.getArgument(argumentName)

      /**
       * If there's no argument, but the argument is optional
       * then we can go to the next iteration
       */
      if (!hasArg && !argDefinition.isRequired) {
        continue
      }

      /**
       * Some values are stored in the context in the same space
       * of the aguments, (see the CommandContext reserverd words)
       * this way they don't require an argument definition
       */
      const value = this.$context.get(argumentName)
      const isSpecialValue = !hasArg && value

      if (hasArg || isSpecialValue) {
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
    this.checkPermissions()

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
