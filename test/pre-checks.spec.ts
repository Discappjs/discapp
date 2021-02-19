import { PermissionString } from 'discord.js'
import { BaseCommand, Command, Invoker, allOf, oneOf } from '../src'
import { makeFakeContext, makeFakeMember } from './helpers/factories'

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

@Command({
  code: 'not-guild-only',
})
class NotGuildOnlyCommand extends BaseCommand {
  public execute() {}
}

@Command({
  clientRoles: ['admin'],
})
class ClientRole extends BaseCommand {
  public execute() {}
}

@Command({
  clientRoles: allOf('admin', 'moderator'),
})
class AllOfClientRole extends BaseCommand {
  public execute() {}
}

@Command({
  clientRoles: oneOf('admin', 'moderator'),
})
class OneOfClientRole extends BaseCommand {
  public execute() {}
}

@Command({
  clientPermissions: allOf<PermissionString>('SEND_MESSAGES', 'ADD_REACTIONS'),
})
class AllOfClientPermission extends BaseCommand {
  public execute() {}
}

@Command({
  clientPermissions: oneOf<PermissionString>('ADD_REACTIONS'),
})
class OneOfClientPermission extends BaseCommand {
  public execute() {}
}

describe('Roles and permisssions', () => {
  describe('User Roles', () => {
    it('should allow if user have the role', () => {
      const context = makeFakeContext({
        member: makeFakeMember({
          roles: ['admin'],
        }),
      })

      return expect(
        new Invoker(RoleCommand).withContext(context).invoke()
      ).resolves.not.toThrow()
    })

    it("should throw if user doesn't have the role", () => {
      const context = makeFakeContext()

      return expect(
        new Invoker(RoleCommand).withContext(context).invoke()
      ).rejects.toThrow()
    })

    it("should throw if user doesn't have one of the roles", () => {
      const context = makeFakeContext({
        member: makeFakeMember({
          roles: ['admin'],
        }),
      })

      return expect(
        new Invoker(MultipleRoleCommand).withContext(context).invoke()
      ).rejects.toThrow()
    })

    it("should throw if user doesn't have one of roles assigned as allOf", () => {
      const context = makeFakeContext({
        member: makeFakeMember({
          roles: ['admin'],
        }),
      })

      return expect(
        new Invoker(AllOfRoleCommand).withContext(context).invoke()
      ).rejects.toThrow()
    })

    it('should allow if user have all of roles assigned as allOf', () => {
      const context = makeFakeContext({
        member: makeFakeMember({
          roles: ['admin', 'mantainer'],
        }),
      })

      return expect(
        new Invoker(AllOfRoleCommand).withContext(context).invoke()
      ).resolves.not.toThrow()
    })

    it('should allow if user has at leat one of the roles assigned as oneOf', () => {
      const context = makeFakeContext({
        member: makeFakeMember({
          roles: ['admin'],
        }),
      })

      return expect(
        new Invoker(OneOfRoleCommand).withContext(context).invoke()
      ).resolves.not.toThrow()
    })

    it("should throw if user doesn't has at leat any of the roles assigned as oneOf", () => {
      const context = makeFakeContext()

      return expect(
        new Invoker(OneOfRoleCommand).withContext(context).invoke()
      ).rejects.toThrow()
    })
  })

  describe('User Permissions', () => {
    it('should allow if user have the permission', () => {
      const context = makeFakeContext({
        member: makeFakeMember({
          hasPermission() {
            return true
          },
        }),
      })

      return expect(
        new Invoker(PermissionCommand).withContext(context).invoke()
      ).resolves.not.toThrow()
    })

    it("should throw if user does'nt have the permission", () => {
      const context = makeFakeContext({
        member: makeFakeMember({
          hasPermission() {
            return false
          },
        }),
      })

      return expect(
        new Invoker(PermissionCommand).withContext(context).invoke()
      ).rejects.toThrow()
    })

    it("should throw if user does'nt have one of the permissions", () => {
      const context = makeFakeContext({
        member: makeFakeMember({
          hasPermission(permission: PermissionString) {
            return permission === 'ADD_REACTIONS' ? false : true
          },
        }),
      })

      return expect(
        new Invoker(MultiplePermissionCommand).withContext(context).invoke()
      ).rejects.toThrow()
    })

    it("should throw if user does'nt have one of the permissions assigned as allOf", () => {
      const context = makeFakeContext({
        member: makeFakeMember({
          hasPermission(permission: PermissionString) {
            return permission === 'ADD_REACTIONS' ? false : true
          },
        }),
      })

      return expect(
        new Invoker(AllOfPermissionCommannd).withContext(context).invoke()
      ).rejects.toThrow()
    })

    it('should allow if user has all the permissions assigned as allOf', () => {
      const context = makeFakeContext()

      return expect(
        new Invoker(AllOfPermissionCommannd).withContext(context).invoke()
      ).resolves.not.toThrow()
    })
  })

  describe('Guild-only', () => {
    it('should allow to execute not guild-only command from outside a guild', () => {
      const FakeContext = makeFakeContext({
        isGuild: false,
      })

      return expect(
        new Invoker(NotGuildOnlyCommand).withContext(FakeContext).invoke()
      ).resolves.not.toThrow()
    })

    it('should not allow to execute guild-only command from outside a guild', () => {
      const FakeContext = makeFakeContext({
        isGuild: false,
      })

      return expect(
        new Invoker(GuildOnlyCommand).withContext(FakeContext).invoke()
      ).rejects.toThrow()
    })
  })

  describe('Client Roles', () => {
    it('should allow invoking a command if client have the role', () => {
      const context = makeFakeContext({
        client: makeFakeMember({
          roles: ['admin'],
        }),
      })

      return expect(
        new Invoker(ClientRole).withContext(context).invoke()
      ).resolves.not.toThrow()
    })

    it('should throw if one of the roles assigned as allOf is missing', () => {
      const firstContext = makeFakeContext({
        client: makeFakeMember({
          roles: ['admin'],
        }),
      })
      const secondContext = makeFakeContext({
        client: makeFakeMember({
          roles: ['moderator'],
        }),
      })

      expect(
        new Invoker(AllOfClientRole).withContext(firstContext).invoke()
      ).rejects.toThrow()
      expect(
        new Invoker(AllOfClientRole).withContext(secondContext).invoke()
      ).rejects.toThrow()
    })

    it('should allow if all roles assigned as allOf exists', () => {
      const context = makeFakeContext({
        client: makeFakeMember({
          roles: ['admin', 'moderator'],
        }),
      })

      expect(
        new Invoker(AllOfClientRole).withContext(context).invoke()
      ).resolves.not.toThrow()
    })

    it('should allow if one of roles assigned as oneOf exists', () => {
      const firstContext = makeFakeContext({
        client: makeFakeMember({
          roles: ['admin'],
        }),
      })
      const secondContext = makeFakeContext({
        client: makeFakeMember({
          roles: ['moderator'],
        }),
      })

      expect(
        new Invoker(OneOfClientRole).withContext(firstContext).invoke()
      ).resolves.not.toThrow()
      expect(
        new Invoker(OneOfClientRole).withContext(secondContext).invoke()
      ).resolves.not.toThrow()
    })

    it("should throw if user doesn't have none any of the roles assigned as oneOf", () => {
      const firstContext = makeFakeContext({
        client: makeFakeMember({
          roles: ['mantainer'],
        }),
      })
      const secondContext = makeFakeContext()

      expect(
        new Invoker(OneOfClientRole).withContext(firstContext).invoke()
      ).rejects.toThrow()
      expect(
        new Invoker(OneOfClientRole).withContext(secondContext).invoke()
      ).rejects.toThrow()
    })
  })

  describe('Client Permissions', () => {
    it('should allow if user has all of the permissions assigned as allOf', () => {
      const context = makeFakeContext({
        client: makeFakeMember({
          hasPermission() {
            return true
          },
        }),
      })

      expect(
        new Invoker(AllOfClientPermission).withContext(context).invoke()
      ).resolves.not.toThrow()
    })

    it("should throw if doesn't have one of the permission assigned as allOf", () => {
      const context = makeFakeContext({
        client: makeFakeMember({
          hasPermission(permission) {
            return permission === 'SEND_MESSAGES'
          },
        }),
      })

      expect(
        new Invoker(AllOfClientPermission).withContext(context).invoke()
      ).rejects.toThrow()
    })

    it('should allow if client has one of the permissions assinged as oneOf', () => {
      const context = makeFakeContext({
        client: makeFakeMember({
          hasPermission() {
            return true
          },
        }),
      })

      expect(
        new Invoker(OneOfClientPermission).withContext(context).invoke()
      ).resolves.not.toThrow()
    })

    it("should throw if client doesn't have one of the roles assigned as oneOf", () => {
      const context = makeFakeContext({
        client: makeFakeMember({
          hasPermission() {
            return false
          },
        }),
      })

      expect(
        new Invoker(OneOfClientPermission).withContext(context).invoke()
      ).rejects.toThrow()
    })
  })
})
