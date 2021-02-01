import CommandContextContract from '../CommandContext/CommandContextContract'
import { InvokerHooks } from '../types'

export default interface InvokerContract {
  withHooks(hooks: InvokerHooks): this
  withContext(context: CommandContextContract): this
  invoke(): Promise<any>
}
