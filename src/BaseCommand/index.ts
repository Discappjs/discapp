import { PermissionString } from 'discord.js'

import InvalidArgumentException from '../Exceptions/InvalidArgumentException'
import CommandContract from './CommandContract'
import { ArgumentDescriptor } from '../types'

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
   * Command required permissionss
   */
  public static $permissions = new Set<PermissionString>()

  /**
   * Command required roles
   */
  public static $roles = new Set<string>()

  /**
   * Whether the Command was booted
   */
  private static $isBooted = false

  /**
   * Boots the Command
   */
  public static boot() {
    if (!this.$isBooted) {
      this.$arguments = []
      this.code = ''
      this.description = ''
      this.$assocs = new Map<string, string>()
      this.$roles = new Set<string>()
      this.$permissions = new Set<PermissionString>()
    }

    this.$isBooted = true

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
   * Set the permissions for the command
   *
   * @param permissions The permissions
   */
  public static setPermissions(permissions: PermissionString[]) {
    for (const permission of permissions) {
      this.$permissions.add(permission)
    }

    return this
  }
  /**
   * Set the roles for the command
   *
   * @param roles The roles
   */
  public static setRoles(roles: string[]) {
    for (const role of roles) {
      this.$roles.add(role)
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
