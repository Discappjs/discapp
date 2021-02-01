import CommandContract from './CommandContract'
import { ArgumentDescriptor } from '../types'

export default interface StaticCommandContract {
  code: string
  description: string
  $arguments: ArgumentDescriptor[]
  $assocs: Map<string, string>

  new (): CommandContract
  boot(): void
  setCode(name: string): this
  setDescription(description: string): this
  addAssoc(propertyKey: string, argumentKey: string): this
  addArgument(arg: ArgumentDescriptor): this
  getArgument(name: string): ArgumentDescriptor | undefined
  validate(): boolean
}
