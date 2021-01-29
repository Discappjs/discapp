import { CommandConstructorContract } from './types'

export default class Storage {
  /**
   * The commands
   */
  private static readonly $commands: CommandConstructorContract[] = []

  /**
   * Returns all the commands
   */
  public static getAllCommands() {
    return [...this.$commands]
  }

  /**
   * Removes the command
   */
  public static removeCommand(Command: CommandConstructorContract) {
    const index = this.$commands.indexOf(Command)
    this.$commands.splice(index, 1)

    return this
  }

  /**
   * Registers the command
   *
   * @param command The command
   */
  public static addCommand(...Command: CommandConstructorContract[]) {
    this.$commands.push(...Command)

    return this
  }
}
