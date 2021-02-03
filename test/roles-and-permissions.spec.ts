import { GuildMember, PermissionString } from 'discord.js'
import { BaseCommand, Command, CommandContext, Invoker } from '../src'

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

describe('Roles and permisssions', () => {
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
        cache: ['admin'],
      },
    } as unknown) as GuildMember)

    return expect(
      new Invoker(MultipleRoleCommand).withContext(context).invoke()
    ).rejects.toThrow()
  })
})
