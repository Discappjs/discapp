import { ArgumentDescriptor } from './types'

export default class CommandDescriptor {
  /**
   * The command name
   */
  private $name = ''

  /**
   * The command description
   */
  private $description = ''

  /**
   * The command target
   */
  private $target: any = null

  /**
   * The command instanceee
   */
  private $instance: any = null

  /**
   * The command arguments
   */
  private $arguments: ArgumentDescriptor[] = []

  /**
   * The associations
   */
  private $assocs = new Map<string, string>()

  /**
   * Sets the property in the command instance
   *
   * @param property The property
   * @param value The value
   */
  public setProperty(key: string, value: any) {
    Object.defineProperty(this.$instance, key, {
      configurable: true,
      enumerable: true,
      value,
    })

    return this
  }

  /**
   * Associates a property with a argument
   *
   * @param property The property of the command
   * @param key The key of the argument
   */
  public addAssoc(property: string, key: string) {
    this.$assocs.set(property, key)

    return this
  }

  /**
   * Return the associations as array of entries
   */
  public getAssocs() {
    return this.$assocs.entries()
  }

  /**
   * Sets the name of the command
   *
   * @param name The name
   */
  public setName(name: string) {
    this.$name = name

    return this
  }

  /**
   * Seets the target of the command
   *
   * @param target The target
   */
  public setTarget(target: any) {
    this.$target = target

    return this
  }

  /**
   * Sets the instance of the command
   *
   * @param instance The instance
   */
  public setInstance(instance: any) {
    this.$instance = instance

    return this
  }

  /**
   * Sets the command description
   *
   * @param description The description
   */
  public setDescription(description: string | undefined) {
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
  public addArgument(arg: ArgumentDescriptor) {
    this.$arguments.push(arg)

    return this
  }

  /**
   * Return the command name
   */
  get name() {
    return this.$name
  }

  /**
   * Returns the command description
   */
  get description() {
    return this.$description
  }

  /**
   * Return the commmand target
   */
  get target() {
    return this.$target
  }

  /**
   * Return the command instance
   */
  get instance() {
    return this.$instance
  }

  /**
   * Returns a copy of the arguments
   */
  get arguments() {
    return [...this.$arguments]
  }
}
