import { Client } from 'discord.js'

import StaticCommandContract from './BaseCommand/StaticCommandContract'
import { isString } from './utils/isType'

export default class Storage {
  /**
   * The client
   */
  private static $client: Client | undefined = undefined

  /**
   * The commands
   */
  private static $commands: StaticCommandContract[] = []

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
   * Gets the client
   */
  public static getClient() {
    if (this.$client) {
      return this.$client
    }

    throw new Error('Client is not defined, is Application already started?')
  }

  /**
   * Sets the client
   */
  public static setClient(client: Client) {
    this.$client = client

    return this
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
