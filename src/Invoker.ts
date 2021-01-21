import CommandContext from './CommandContext'
import CommandDescriptor from './CommandDescriptor'
import { InvokerHooks } from './types'
import callEach from './utils/callEach'

export default class Invoker {
  /**
   * The invoker context
   */
  private $context = new CommandContext()

  /**
   * Invoker hooks
   */
  private readonly $hooks: InvokerHooks = {
    afterCommand: [],
    beforeCommand: [],
  }

  constructor(private readonly $descriptor: CommandDescriptor) {}

  /**
   * Sets the hooks for the invoker
   */
  public withHooks(hooks: InvokerHooks) {
    this.$hooks.beforeCommand.push(...hooks.beforeCommand)
    this.$hooks.afterCommand.push(...hooks.afterCommand)

    return this
  }

  /**
   * Sets the context for this Invoker instance
   *
   * @param context The context
   */
  public withContext(context: CommandContext) {
    this.$context = context

    return this
  }

  /**
   * Set the associateds properties in the command instance
   */
  private setAssociatedProperties() {
    for (const [propertyName, argumentName] of this.$descriptor.getAssocs()) {
      if (this.$context.hasArgument(argumentName)) {
        const value = this.$context.getArgument(argumentName)
        this.$descriptor.setProperty(propertyName, value)
      } else {
        throw new Error(`Argument ${argumentName} does not exists`)
      }
    }
  }

  /**
   * Invokes the command
   */
  public async invoke() {
    await callEach(this.$hooks.beforeCommand, [
      {
        context: this.$context,
        descriptor: this.$descriptor,
      },
    ])

    this.setAssociatedProperties()
    const response = await this.$descriptor.instance.execute()

    await callEach(this.$hooks.afterCommand, [
      {
        context: this.$context,
        descriptor: this.$descriptor,
      },
    ])

    return response
  }
}
