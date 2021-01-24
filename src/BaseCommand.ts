import { ArgumentDescriptor } from './types'

export default abstract class BaseCommand {
  /**
   * The command name
   */
  public static $name = ''

  /**
   * The command description
   */
  public static $description = ''

  /**
   * The command arguments
   */
  public static $arguments: ArgumentDescriptor[] = []

  /**
   * The associations
   */
  private static $assocs = new Map<string, string>()

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
      this.$name = ''
      this.$description = ''
      this.$assocs = new Map<string, string>()
    }

    this.$isBooted = true
  }

  /**
   * Sets the name of the command
   *
   * @param name The name
   */
  public static setName(name: string) {
    this.$name = name

    return this
  }

  /**
   * Sets the command description
   *
   * @param description The description
   */
  public static setDescription(description: string | undefined) {
    if (description) {
      this.$description = description
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
   * Sets the property in the command instance
   *
   * @param property The property
   * @param value The value
   */
  public setProperty(key: string, value: any) {
    Object.defineProperty(this, key, {
      configurable: true,
      enumerable: true,
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
   * Executes the command
   */
  abstract execute(): any
}
