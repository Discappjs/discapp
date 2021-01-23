import { CommandConstructorContract } from '../types'

export default function Author() {
  return (target: any, key: string) => {
    const Command = target.constructor as CommandConstructorContract
    Command.addAssoc(key, 'author')
    return target
  }
}
