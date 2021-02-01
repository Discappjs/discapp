import CommandContextContract from '../CommandContext/CommandContextContract'

export default interface ParserContract {
  forCommand(command: any): this
  isValid(): boolean
  makeContext(originalContent: string): CommandContextContract
}
