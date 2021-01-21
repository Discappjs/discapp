import CommandDescriptor from './CommandDescriptor'

export default class Storage {
  /**
   * The commands
   */
  private readonly $commands: CommandDescriptor[] = []

  /**
   * Returns all the command
   */
  public getAllCommands() {
    return [...this.$commands]
  }

  /**
   * Get the command if it already exists or creates it,
   * also return the command descriptor
   *
   * @param target The target
   */
  public getOrCreateCommand(target: any) {
    const command = this.getCommand(target)

    if (command) {
      return command
    } else {
      const descriptor = new CommandDescriptor().setTarget(target)
      this.$commands.push(descriptor)

      return descriptor
    }
  }

  /**
   * Return the command for the target
   * Returns undefined if the target is not registered
   *
   * @param target The target
   */
  public getCommand(target: any) {
    return this.$commands.find(command => {
      return command.target === target
    })
  }
}

export const storage = new Storage()
