import { GuildMember, PermissionString } from 'discord.js'
import {
  BaseCommand,
  Command,
  CommandContext,
  Invoker,
  allOf,
  oneOf,
  CommandContextContract,
} from '../src'

@Command({
  code: 'permission',
  permissions: ['SEND_MESSAGES'],
})
class PermissionCommand extends BaseCommand {
  public execute() {}
}

@Command({
  code: 'multiple_permission',
  permissions: ['SEND_MESSAGES', 'ADD_REACTIONS'],
})
class MultiplePermissionCommand extends BaseCommand {
  public execute() {}
}

@Command({
  code: 'all_of_permission',
  permissions: allOf('SEND_MESSAGES', 'ADD_REACTIONS'),
})
class AllOfPermissionCommannd extends BaseCommand {
  public execute() {}
}

@Command({
  code: 'role',
  roles: ['admin'],
})
class RoleCommand extends BaseCommand {
  public execute() {}
}

@Command({
  code: 'multiple_role',
  roles: ['admin', 'mantainer'],
})
class MultipleRoleCommand extends BaseCommand {
  public execute() {}
}

@Command({
  code: 'all_of_role',
  roles: allOf('admin', 'mantainer'),
})
class AllOfRoleCommand extends BaseCommand {
  public execute() {}
}

@Command({
  code: 'one_of_role',
  roles: oneOf('admin', 'mantainer'),
})
class OneOfRoleCommand extends BaseCommand {
  public execute() {}
}

@Command({
  code: 'guild-only',
  isGuildOnly: true,
})
class GuildOnlyCommand extends BaseCommand {
  public execute() {}
}

describe('Roles and permisssions', () => {
  describe('Roles', () => {
    it('should allow if user have the role', () => {
      const context = new CommandContext()

      context.setMember(({
        roles: {
          cache: [
            {
              name: 'admin',
            },
          ],
        },
      } as unknown) as GuildMember)

      return expect(
        new Invoker(RoleCommand).withContext(context).invoke()
      ).resolves.not.toThrow()
    })

    it("should throw if user doesn't have the role", () => {
      const context = new CommandContext()

      context.setMember(({
        roles: {
          cache: [],
        },
      } as unknown) as GuildMember)

      return expect(
        new Invoker(RoleCommand).withContext(context).invoke()
      ).rejects.toThrow()
    })

    it("should throw if user doesn't have the role", () => {
      const context = new CommandContext()

      context.setMember(({
        roles: {
          cache: [],
        },
      } as unknown) as GuildMember)

      return expect(
        new Invoker(RoleCommand).withContext(context).invoke()
      ).rejects.toThrow()
    })

    it("should throw if user doesn't have one of the roles", () => {
      const context = new CommandContext()

      context.setMember(({
        roles: {
          cache: [
            {
              name: 'adminn',
            },
          ],
        },
      } as unknown) as GuildMember)

      return expect(
        new Invoker(MultipleRoleCommand).withContext(context).invoke()
      ).rejects.toThrow()
    })

    it("should throw if user doesn't have one of roles assigned as allOf", () => {
      const context = new CommandContext()

      context.setMember(({
        roles: {
          cache: [
            {
              name: 'admin',
            },
          ],
        },
      } as unknown) as GuildMember)

      return expect(
        new Invoker(AllOfRoleCommand).withContext(context).invoke()
      ).rejects.toThrow()
    })

    it('should allow if user have all of roles assigned as allOf', () => {
      const context = new CommandContext()

      context.setMember(({
        roles: {
          cache: [
            {
              name: 'admin',
            },
            {
              name: 'mantainer',
            },
          ],
        },
      } as unknown) as GuildMember)

      return expect(
        new Invoker(AllOfRoleCommand).withContext(context).invoke()
      ).resolves.not.toThrow()
    })

    it('should allow if user has at leat one of the roles assigned as oneOf', () => {
      const context = new CommandContext()

      context.setMember(({
        roles: {
          cache: [
            {
              name: 'admin',
            },
          ],
        },
      } as unknown) as GuildMember)

      return expect(
        new Invoker(OneOfRoleCommand).withContext(context).invoke()
      ).resolves.not.toThrow()
    })

    it("should throw if user doesn't has at leat any of the roles assigned as oneOf", () => {
      const context = new CommandContext()

      context.setMember(({
        roles: {
          cache: [],
        },
      } as unknown) as GuildMember)

      return expect(
        new Invoker(OneOfRoleCommand).withContext(context).invoke()
      ).rejects.toThrow()
    })
  })

  describe('Permission', () => {
    it('should allow if user have the permission', () => {
      const context = new CommandContext()

      context.setMember(({
        hasPermission: () => true,
      } as unknown) as GuildMember)

      return expect(
        new Invoker(PermissionCommand).withContext(context).invoke()
      ).resolves.not.toThrow()
    })

    it("should throw if user does'nt have the permission", () => {
      const context = new CommandContext()

      context.setMember(({
        hasPermission: () => false,
      } as unknown) as GuildMember)

      return expect(
        new Invoker(PermissionCommand).withContext(context).invoke()
      ).rejects.toThrow()
    })

    it("should throw if user does'nt have one of the permissions", () => {
      const context = new CommandContext()

      context.setMember(({
        hasPermission: (permission: PermissionString) => {
          return permission === 'ADD_REACTIONS' ? false : true
        },
      } as unknown) as GuildMember)

      return expect(
        new Invoker(MultiplePermissionCommand).withContext(context).invoke()
      ).rejects.toThrow()
    })

    it("should throw if user does'nt have one of the permissions assigned as allOf", () => {
      const context = new CommandContext()

      context.setMember(({
        hasPermission: (permission: PermissionString) => {
          return permission === 'ADD_REACTIONS' ? false : true
        },
      } as unknown) as GuildMember)

      return expect(
        new Invoker(AllOfPermissionCommannd).withContext(context).invoke()
      ).rejects.toThrow()
    })

    it('should allow if user has all tthe permissions assigned as allOf', () => {
      const context = new CommandContext()

      context.setMember(({
        hasPermission: () => true,
      } as unknown) as GuildMember)

      return expect(
        new Invoker(AllOfPermissionCommannd).withContext(context).invoke()
      ).resolves.not.toThrow()
    })
  })

  describe('Guild-only', () => {
    it('should not allow to execute guild-only command from outside a guild', () => {
      const FakeContext = {
        getMember() {
          return {}
        },

        isGuild() {
          return true
        },
      } as CommandContextContract

      return expect(
        new Invoker(GuildOnlyCommand).withContext(FakeContext).invoke()
      ).resolves.not.toThrow()
    })

    it('should not allow to execute guild-only command from outside a guild', () => {
      const FakeContext = {
        getMember() {
          return {}
        },

        isGuild() {
          return false
        },
      } as CommandContextContract

      return expect(
        new Invoker(GuildOnlyCommand).withContext(FakeContext).invoke()
      ).rejects.toThrow()
    })
  })
})
