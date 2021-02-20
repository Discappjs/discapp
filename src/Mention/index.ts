import { User } from 'discord.js'

import CommandContextContract from '../CommandContext/CommandContextContract'

function fakeUser(): { new (): User } {
  return class {} as any
}

export default class Mention extends fakeUser() {
  constructor(
    public user: User,
    private readonly $context: CommandContextContract
  ) {
    super()

    return new Proxy(this, {
      get(target: any, key: string) {
        if (key === 'user') {
          return target.user
        }

        if (target.user[key]) {
          return typeof target.user[key] === 'function'
            ? target.user[key].bind(target.user)
            : target.user[key]
        }

        return target[key]
      },
    })
  }

  /**
   * Return the mentioned user as a guild member
   */
  public asMember() {
    return this.$context.getGuild().members.fetch(this.id)
  }
}
