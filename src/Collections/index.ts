export enum CollectionType {
  ONE_OF,
  ALL_OF,
}

export abstract class Collection {
  protected $collection = new Set<string>()

  abstract get type(): CollectionType

  public add(rp: string) {
    this.$collection.add(rp)

    return this
  }

  public has(rp: string) {
    return this.$collection.has(rp)
  }

  [Symbol.iterator]() {
    return this.$collection.values()
  }
}

class OneOf extends Collection {
  public type = CollectionType.ONE_OF
}

class AllOf extends Collection {
  public type = CollectionType.ALL_OF
}

export function oneOf<T extends string = string>(...roleOrPermissions: T[]) {
  const collection = new OneOf()

  for (const roleOrPermission of roleOrPermissions) {
    collection.add(roleOrPermission)
  }

  return collection
}

export function allOf<T extends string = string>(...roleOrPermissions: T[]) {
  const collection = new AllOf()

  for (const roleOrPermission of roleOrPermissions) {
    collection.add(roleOrPermission)
  }

  return collection
}
