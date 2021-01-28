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
   * Registers the command
   *
   * @param command The command
   */
  public static addCommand(Command: CommandConstructorContract) {
    this.$commands.push(Command)
  }
}
