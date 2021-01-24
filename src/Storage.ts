import { CommandConstructorContract } from '.'

export default class Storage {
  /**
   * The commands
   */
  private readonly $commands: CommandConstructorContract[] = []

  /**
   * Returns all the command
   */
  public getAllCommands() {
    return [...this.$commands]
  }

  /**
   * Registers the command
   *
   * @param command The command
   */
  public addCommand(command: CommandConstructorContract) {
    this.$commands.push(command)
  }
}

export const storage = new Storage()
