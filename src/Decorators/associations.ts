import StaticCommandContract from '../BaseCommand/StaticCommandContract'

function createAssociation(argName: string) {
  return function() {
    return (target: any, property: string) => {
      const Command = target.constructor as StaticCommandContract
      Command.boot()
      Command.addAssoc(property, argName || property)
    }
  }
}

export const Author = createAssociation('author')
export const Channel = createAssociation('channel')