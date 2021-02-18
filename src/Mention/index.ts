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
        return key in target.user ? target.user[key] : target[key]
      },
    })
  }

  public asMember() {
    return this.$context.getGuild().members.fetch(this.id)
  }
}
