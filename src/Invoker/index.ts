import { GuildMember, PermissionString } from 'discord.js'

import CommandContract from '../BaseCommand/CommandContract'
import StaticCommandContract from '../BaseCommand/StaticCommandContract'
import CommandContext from '../CommandContext'
import CommandContextContract from '../CommandContext/CommandContextContract'
import InvokerContract from './InvokerContract'
import callEach from '../utils/callEach'
import ForbiddenCommandException from '../Exceptions/ForbiddenCommandException'
import { Collection, CollectionType } from '../Collections'
import { InvokerHooks } from '../types'

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
  public withContext(context: CommandContextContract) {
    this.$context = context

    return this
  }

  /**
   * Check if the user has the required permissions
   *
   * @param member The member
   * @param $permissions The required permissions
   */
  private checkPermissions(member: GuildMember, $permissions: Collection) {
    for (const $permission of $permissions) {
      /**
       * Check if the user has the permissionn
       */
      const hasRole = member.hasPermission($permission as PermissionString)

      /**
       * If the collection is of the type 'AllOf', then if the user
       * doesn't have one of the roles we should  throw
       */
      if ($permissions.type === CollectionType.ALL_OF) {
        if (!hasRole) {
          const requiredPermissions = Array.from($permissions).join(', ')

          throw new ForbiddenCommandException(
            'MISSING_PERMISSION',
            this.Command.code,
            requiredPermissions,
            `This command required you to have the roles: ${requiredPermissions}, but you don't`
          )
        }
      }

      /**
       * If the collection is of the type 'OneOf', then if user has
       * one of the roles we should return true
       */
      if ($permissions.type === CollectionType.ONE_OF) {
        if (hasRole) {
          return true
        }
      }
    }

    /**
     * If the collection is of the type 'AllOf', then if nothing
     * then the user has the permission
     */
    if ($permissions.type === CollectionType.ALL_OF) {
      return true
    }

    /**
     * If the collection is of the type 'OneOf', then if nothing
     * was returned the user doesn't have permission, hence we
     * should throw
     */
    if ($permissions.type === CollectionType.ONE_OF) {
      const requiredPermissions = Array.from($permissions).join(', ')

      throw new ForbiddenCommandException(
        'MISSING_PERMISSION',
        this.Command.code,
        requiredPermissions,
        `This command required you to have one of the permissions: ${requiredPermissions}, but you don't have any`
      )
    }

    return true
  }

  /**
   * Check if the member has the required roles
   *
   * @param member The member
   * @param $roles The required roles
   */
  private checkRoles(member: GuildMember, $roles: Collection) {
    for (const $role of $roles) {
      /**
       * Check if the user has an role with an id or name that
       * matches
       */
      const hasRole = member.roles.cache.find(
        role => role.name === $role || role.id === $role
      )

      /**
       * If the collection is of the type 'AllOf', then if the user
       * doesn't have one of the roles we should  throw
       */
      if ($roles.type === CollectionType.ALL_OF) {
        if (!hasRole) {
          const requiredRoles = Array.from($roles).join(', ')

          throw new ForbiddenCommandException(
            'MISSING_ROLE',
            this.Command.code,
            requiredRoles,
            `This command required you to have the roles: ${requiredRoles}, but you don't`
          )
        }
      }

      /**
       * If the collection is of the type 'OneOf', then if user has
       * one of the roles we should return true
       */
      if ($roles.type === CollectionType.ONE_OF) {
        if (hasRole) {
          return true
        }
      }
    }

    /**
     * If the collection is of the type 'AllOf', then if nothing
     * then the user has the permission
     */
    if ($roles.type === CollectionType.ALL_OF) {
      return true
    }

    /**
     * If the collection is of the type 'OneOf', then if nothing
     * was returned the user doesn't have permission, hence we
     * should throw
     */
    if ($roles.type === CollectionType.ONE_OF) {
      const requiredRoles = Array.from($roles).join(', ')

      throw new ForbiddenCommandException(
        'MISSING_ROLE',
        this.Command.code,
        requiredRoles,
        `This command required you to have one of the roles: ${requiredRoles}, but you don't have any`
      )
    }

    return true
  }

  /**
   * Throws if command is guild only but context isn't
   */
  private guildMatches() {
    if (this.Command.$guildOnly !== this.$context.isGuild()) {
      throw new ForbiddenCommandException(
        'GUILD_ONLY_COMMAND',
        this.Command.code,
        'guild',
        `The command you're trying to execute is assigned as guild-only, but you trying to execute it from outside a guild.`
      )
    }

    return true
  }

  /**
   * Check if the user has permission for executing this command
   */
  private canExecute() {
    const member = this.$context.getMember()
    const { $roles, $permissions } = this.Command
    const hasRoles = this.checkRoles(member, $roles)
    const hasPermissions = this.checkPermissions(member, $permissions)
    const guildMatches = this.guildMatches()

    return hasRoles && hasPermissions && guildMatches
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
     * The response of the command
     */
    let response: any = undefined

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

    try {
      /**
       * Ensures the user can execute this command, otherwise
       * throws an error
       */
      this.canExecute()

      /**
       * Inject the properties into the command
       */
      this.setAssociatedProperties()

      /**
       * Call the global 'afterCommand' hooks. Useful for plugins
       * to being able to hook into a Discapp application.
       */
      await this.$command.beforeExecute()

      response = await this.$command.execute()

      /**
       * Executes the 'afterExecute' function, if it exists after
       * executing the command
       */
      await this.$command.afterExecute()
    } catch (error) {
      throw error
    } finally {
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
    }

    return response
  }
}
