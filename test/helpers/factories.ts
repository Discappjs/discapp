import { GuildMember } from 'discord.js'

import { CommandContextContract } from '../../src'

export function makeFakeMember({
  hasPermission = (() => true) as any,
  roles = [] as string[],
} = {}): GuildMember {
  return {
    roles: {
      cache: roles.map(role => ({ name: role })),
    },

    hasPermission: hasPermission,
  } as any
}

export function makeFakeContext({
  isGuild = true,
  member = makeFakeMember(),
  client = makeFakeMember(),
} = {}): CommandContextContract {
  const store = new Map<string, string>()

  return {
    set(key: string, value: string) {
      store.set(key, value)
      return this
    },

    get(key: string) {
      return store.get(key)
    },

    has(key: string) {
      return store.has(key)
    },

    getMember() {
      return member
    },

    getGuild() {
      return {
        me: client,
      }
    },

    isGuild() {
      return isGuild
    },
  } as any
}
