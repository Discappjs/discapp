import { storage } from '../Storage'

export default function Author() {
  return (target: any, key: string) => {
    storage.getOrCreateCommand(target).addAssoc(key, 'author')

    return target
  }
}
