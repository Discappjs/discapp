import { PermissionString } from 'discord.js'

import InvalidArgumentException from '../Exceptions/InvalidArgumentException'
import CommandContract from './CommandContract'
import { ArgumentDescriptor } from '../types'
import { allOf, Collection } from '../Collections'

export default abstract class BaseCommand implements CommandContract {
  /**
   * The command name
   */
  public static code = ''

  /**
   * The command description
   */
  public static description = ''

  /**
   * The command arguments
   */
  public static $arguments: ArgumentDescriptor[] = []

  /**
   * The associations
   */
  public static $assocs = new Map<string, string>()

  /**
   * User required permissionss
   */
  public static $permissions: Collection = allOf()

  /**
   * User required roles
   */
  public static $roles: Collection = allOf()

  /**
   * Client required permissionss
   */
  public static $clientPermissions: Collection = allOf()

  /**
   * Client required roles
   */
  public static $clientRoles: Collection = allOf()

  /**
   * Whether the Command was booted
   */
  private static $isBooted = false

  /**
   * Whether the Command is guild only
   */
  public static $guildOnly = false

  /**
   * Boots the Command
   */
  public static boot() {
    if (!this.$isBooted) {
      this.$arguments = []
      this.code = ''
      this.description = ''
      this.$assocs = new Map<string, string>()
      this.$roles = allOf()
      this.$permissions = allOf()
      this.$clientPermissions = allOf()
      this.$clientRoles = allOf()
    }

    this.$isBooted = true

    return this
  }

  /**
   * Sets the command as guild only
   */
  public static setGuildOnly(guildOnly: boolean) {
    this.$guildOnly = guildOnly

    return this
  }

  /**
   * Sets the name of the command
   *
   * @param name The name
   */
  public static setCode(name: string) {
    this.code = name

    return this
  }

  /**
   * Sets the command description
   *
   * @param description The description
   */
  public static setDescription(description: string | undefined) {
    if (description) {
      this.description = description
    }

    return this
  }

  /**
   * Set the user required permissions
   *
   * @param permissions The permissions
   */
  public static setPermissions(permissions: PermissionString[] | Collection) {
    if (Array.isArray(permissions)) {
      this.$permissions = allOf(...permissions)
    } else {
      this.$permissions = permissions
    }

    return this
  }

  /**
   * Set the user required roles
   *
   * @param roles The roles
   */
  public static setRoles(roles: string[]) {
    if (Array.isArray(roles)) {
      this.$roles = allOf(...roles)
    } else {
      this.$roles = roles
    }

    return this
  }

  /**
   * Set the client required permissions
   *
   * @param permissions The permissions
   */
  public static setClientPermissions(
    permissions: PermissionString[] | Collection
  ) {
    if (Array.isArray(permissions)) {
      this.$clientPermissions = allOf(...permissions)
    } else {
      this.$clientPermissions = permissions
    }

    return this
  }

  /**
   * Set the client required roles
   *
   * @param roles The roles
   */
  public static setClientRoles(roles: string[]) {
    if (Array.isArray(roles)) {
      this.$clientRoles = allOf(...roles)
    } else {
      this.$clientRoles = roles
    }

    return this
  }

  /**
   * Registers an argument
   *
   * @param arg The argument
   */
  public static addArgument(arg: ArgumentDescriptor) {
    this.$arguments.push(arg)

    return this
  }

  /**
   * Return the argument with the given name
   *
   * @param name The name of the argument
   */
  public static getArgument(name: string) {
    return this.$arguments.find(arg => arg.name === name)
  }

  /**
   * Sets the property in the command instance
   *
   * @param property The property
   * @param value The value
   */
  public setProperty(key: string, value: any) {
    Object.defineProperty(this, key, {
      configurable: true,
      enumerable: true,
      writable: true,
      value,
    })

    return this
  }

  /**
   * Associates a property with a argumewnt
   *
   * @param propertyKey The property of the command
   * @param argumentKey The key of the argument
   */
  public static addAssoc(propertyKey: string, argumentKey: string) {
    this.$assocs.set(propertyKey, argumentKey)

    return this
  }

  /**
   * Throws if the command is not valid
   */
  public static validate() {
    if (this.$arguments.length > 0) {
      /**
       * Loop through the arguments and validates them
       */
      const numberOfArgsDef = this.$arguments.length
      const lastArgument = this.$arguments[numberOfArgsDef - 1]

      /**
       * If the first argument is required, then the following
       * arguments must also be required
       */
      let canBeOptional = !lastArgument.isRequired

      /**
       * If the last argument is an array, then can't
       * exist optional arguments
       */
      if (lastArgument.type === Array) {
        canBeOptional = false
      }

      /**
       * Loop through arguments checking if they are also
       * valid
       */
      for (let i = numberOfArgsDef - 2; i >= 0; --i) {
        const { name, type, isRequired } = this.$arguments[i]

        if (type === Array) {
          throw new InvalidArgumentException(
            'INVALID_ARGUMENT',
            this.code,
            name,
            `Argument ${name} can't be a array.`
          )
        }

        /**
         * After the first required argument or array argument
         * all arguments must be required
         */
        if (canBeOptional && isRequired) {
          canBeOptional = false
        }

        /**
         * If the argument can't be optional but is assigned
         * as one, then we should throw
         */
        if (!canBeOptional && !isRequired) {
          throw new InvalidArgumentException(
            'INVALID_ARGUMENT',
            this.code,
            name,
            `Argument ${name} can't be optional. Optional arguments must be at the end or followed only by optional arguments.`
          )
        }
      }
    }
  }

  /**
   * Executes before the command
   */
  public beforeExecute() {}

  /**
   * Executes after the command
   */
  public afterExecute() {}

  /**
   * Executes the command
   */
  public abstract execute(): any
}
