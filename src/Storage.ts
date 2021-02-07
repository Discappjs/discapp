import ApplicationContract from './Application/ApplicationContract'
import StaticCommandContract from './BaseCommand/StaticCommandContract'
import { isString } from './utils/isType'

export default class Storage {
  /**
   * The commands
   */
  private static $commands: StaticCommandContract[] = []

  /**
   * The application
   */
  private static $app: ApplicationContract | undefined

  /**
   * Code-based predicate
   */
  private static byCodePredicate = (code: string) => {
    return (Command: StaticCommandContract) => Command.code === code
  }

  /**
   * If true then the Storage will work in development
   * mode
   */
  static __DEV_MODE = false

  /**
   * Sets the app
   */
  public static setApp(app: ApplicationContract) {
    this.$app = app

    return this
  }

  /**
   * Get the app
   */
  public static getApp() {
    if (this.$app) {
      return this.$app
    }

    throw new Error('Application not found, was application started?')
  }

  /**
   * Get the command by code
   */
  public static getCommand(code: string): StaticCommandContract | undefined {
    return this.$commands.find(this.byCodePredicate(code))
  }

  /**
   * Return all the command if no predicate is passed
   *
   * @param predicate The predicate
   */
  public static getCommands(
    predicate: (Command: StaticCommandContract) => boolean = () => true
  ) {
    return this.$commands.filter(predicate)
  }

  /**
   * Removes the command
   */
  public static removeCommand(Command: StaticCommandContract | string) {
    if (isString(Command)) {
      this.$commands = this.$commands.filter(
        () => !this.byCodePredicate(Command)
      )
    } else {
      const index = this.$commands.indexOf(Command)

      this.$commands.splice(index, 1)
    }

    return this
  }

  /**
   * Registers the command
   *
   * @param command The command
   */
  public static addCommand(Command: StaticCommandContract) {
    if (this.getCommand(Command.code)) {
      if (this.__DEV_MODE) {
        Storage.removeCommand(Command.code)
      } else {
        throw new Error(`Can't have two commands with the same code`)
      }
    }

    this.$commands.push(Command)

    return this
  }

  /**
   * Clears the storage
   */
  public static clear() {
    this.$commands = []

    return this
  }
}
